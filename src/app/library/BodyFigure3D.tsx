"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CATEGORIES, type CategorySlug } from "../lib/guideVocab";
import bodySpots from "../lib/data/body-spots.json";
import BodyFigure from "./BodyFigure";

/**
 * The library's body: the MakeHuman base mesh (CC0), shaped male and posed
 * with its own skeleton by `scripts/build-body-mesh.mjs`, packed into
 * `/library/body.bin` and fetched only when the figure's column is on
 * screen. Rendered in our own material: matte porcelain, soft light and
 * baked occlusion, no specular and no pearl rim ("a little too shiny").
 *
 * It moves like a camera operator, not a turntable:
 *  - The camera FRAMES the active body system. The hub lists the systems
 *    top to bottom of the body, and the framings follow: each one's centre
 *    sits lower and its view a little wider than the one before, so a
 *    scroll down the list glides the camera DOWN the body (head, face,
 *    throat, shoulder, chest, abdomen, pelvis, thighs) and never zooms out
 *    to the whole figure between two close-ups. Every move runs through two
 *    exponential stages (a critically damped approach): it eases in and
 *    out, and it can never overshoot or turn back on its own.
 *  - Left alone the figure sways slowly, a 40s swing of 7 degrees either
 *    side, on its own clock: a change of system never touches it. A drag
 *    (or the arrow keys) turns it by hand, the sway holding still under the
 *    hand; a moment after letting go it eases home.
 *  - Each system lights its ORGAN, not a region: the cranium, the thyroid,
 *    the thymus and the armpit nodes, a heart, the stomach and liver, the
 *    pelvis, the knees and thighs, and for Skin a halo along the outline.
 *    Soft ellipsoids on the skin (`zones` in body-spots.json), as light,
 *    breathing slowly outward from their centre. Every system carries its
 *    own weight, so a change crossfades from whatever is on screen.
 *
 * Hotspots are HTML, re-projected from the same camera every frame: the
 * active one blue and pulsing with its glass label, the rest grey. A spot
 * out of frame or turned away steps back. Without WebGL, or if the mesh
 * cannot load, the flat figure renders instead.
 */
type Vec3 = [number, number, number];
type Blob = { c: number[]; r: number[]; a: number; w: number };
type Shot = { y: number; half: number };

const H = bodySpots.height;
const SPOT = bodySpots.spots as Record<CategorySlug, Vec3>;
const NORMAL = bodySpots.normals as Record<CategorySlug, Vec3>;
const ZONES = bodySpots.zones as Record<CategorySlug, Blob[]>;
/** The visible clavicle line per side (sternal end, shoulder end), from the mesh build. */
const CLAV = bodySpots.clavicles as [number[], number[]][];
/** Top to bottom of the body: the hub's order, the scan's, the camera's path. */
const ORDER: CategorySlug[] = CATEGORIES.map((c) => c.slug);

/** The framing per system: the height of the centre, the half-height in
    view, and the half-WIDTH that must stay in frame (metres). Down the list
    the centre descends and the view widens steadily, from head and
    shoulders at Brain to the whole figure at Bones, so a scroll walks the
    camera down the body and opens it up. The first cut framed every system
    as a tight close-up (half 0.26 to 0.43) and cropped the shoulders at the
    column's edges: "the body zoom got fucked, it's all jammed in one
    place". The reference's tightest shot shows about half the body. */
type Frame = Shot & { w: number };
const SHOTS: Record<CategorySlug, Frame> = {
  brain: { y: 1.5, half: 0.36, w: 0.24 },
  skin: { y: 1.46, half: 0.4, w: 0.25 },
  hormones: { y: 1.4, half: 0.45, w: 0.27 },
  immune: { y: 1.32, half: 0.5, w: 0.27 },
  heart: { y: 1.28, half: 0.53, w: 0.27 },
  digestive: { y: 1.18, half: 0.6, w: 0.29 },
  sexual: { y: 1.04, half: 0.7, w: 0.32 },
  bones: { y: H / 2 + 0.02, half: H / 2 + 0.06, w: bodySpots.halfWidth + 0.03 },
};
/** The whole figure, shown while the entrance scan runs. */
const FULL: Frame = { y: H / 2, half: H / 2 + 0.08, w: bodySpots.halfWidth + 0.04 };
/** At most this much room above the crown. */
const HEADROOM = 0.06;

const FOV = 26;
const SCAN_FROM = H + 0.05;
const SCAN_TO = -0.05;
const SCAN_MS = 1500;
/** The indicator's light: REGEN blue, the accent's lighter stop, and a paler
    tint of it for the soft edges of a zone and the Skin halo. */
const GLOW = 0x5a74ff;
const GLOW_SOFT = 0xa8b5ff;
/** A change of system crossfades over this long, ease-out, from wherever
    each light is: a half-finished fade carries on, nothing pops. */
const FADE_S = 0.6;
/** The camera's two easing stages (per second): about 0.65s to 90%. */
const CAM_K = 6;
const SWAY_PERIOD = 40;
const SWAY_AMP = (7 * Math.PI) / 180;
/** After a hand turn the figure eases home: about a second, this long after letting go. */
const HOME_K = 4;
const HOME_AFTER_MS = 1200;
/** The Skin halo: a shell this far outside the skin, drawn behind it. */
const HALO = 0.011;
/** Ellipsoid slots in the shader. */
const NB = 24;
const BLOBS = ORDER.flatMap((slug) => ZONES[slug].map((b) => ({ slug, ...b }))).slice(0, NB);

const VERT = /* glsl */ `
  attribute float ao;
  varying float vAo;
  varying vec3 vLocalN;
  varying vec3 vPos;
  varying vec3 vLocal;
  varying vec3 vNormal;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    vAo = ao;
    vLocalN = normal;
    vLocal = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying float vAo;
  varying vec3 vLocalN;
  varying vec3 vPos;
  varying vec3 vLocal;
  varying vec3 vNormal;
  #define NB ${NB}
  uniform vec3 uCamPos, uGlow, uGlowSoft;
  uniform vec4 uB[NB];   // ellipsoid centre (model space), turn in the front plane
  uniform vec4 uR[NB];   // radii, weight
  uniform float uTime, uScan, uRim;
  uniform vec4 uClav[2];   // per side: sternal end xy, shoulder end xy (model space)
  uniform vec3 uRotX;      // the model's x axis in world space (it turns about y)

  // The clavicles as a faint height field over the front of the chest: a
  // low ridge over the bone and a shallow hollow above it, bending the
  // normal by the field's slope. Felt, not drawn: the mesh is too coarse to
  // carry the bone, and a crisp line read as an etching.
  float clavH(vec2 p) {
    float h = 0.0;
    for (int i = 0; i < 2; i++) {
      vec2 S = uClav[i].xy;
      vec2 d = uClav[i].zw - S;
      float t = dot(p - S, d) / dot(d, d);
      vec2 up = normalize(vec2(-d.y, d.x));
      if (up.y < 0.0) up = -up;
      float above = dot(p - S, up);
      float along = smoothstep(-0.05, 0.2, t) * (1.0 - smoothstep(0.78, 1.02, t));
      float fossa = smoothstep(0.12, 0.35, t) * (1.0 - smoothstep(0.7, 0.92, t));
      h += along * 0.0016 * exp(-pow(above / 0.012, 2.0));
      h -= fossa * 0.0018 * exp(-pow((above - 0.027) / 0.017, 2.0));
    }
    return h;
  }

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    float hollow = 0.0;
    float front = smoothstep(0.1, 0.45, normalize(vLocalN).z) * step(0.0, vLocal.z) * step(1.3, vLocal.y) * (1.0 - step(1.56, vLocal.y));
    if (front > 0.0) {
      vec2 p = vLocal.xy;
      float e = 0.0015;
      float h0 = clavH(p);
      float hx = (clavH(p + vec2(e, 0.0)) - h0) / e;
      float hy = (clavH(p + vec2(0.0, e)) - h0) / e;
      n = normalize(n - (hx * uRotX + hy * vec3(0.0, 1.0, 0.0)) * front);
      hollow = max(-h0, 0.0) * front;
    }
    vec3 v = normalize(uCamPos - vPos);
    float ndv = max(dot(n, v), 0.0);

    // Matte porcelain. A soft key from high and to the side with a very
    // long terminator (the light wraps far round a form), a little fill and
    // sky, and a lifted shade: the reference's baked soft light, not a
    // studio key. No specular, no rim.
    vec3 keyDir = normalize(vec3(0.5, 0.78, 0.38));
    float key = smoothstep(-0.9, 1.0, dot(n, keyDir));
    float fill = max(dot(n, normalize(vec3(-0.55, 0.2, 0.8))), 0.0);
    float top = n.y * 0.5 + 0.5;
    float l = clamp(0.16 + 0.6 * key + 0.12 * fill + 0.12 * top, 0.0, 1.0);
    vec3 shade = vec3(0.775, 0.78, 0.795);
    vec3 lit = vec3(0.976, 0.976, 0.979);
    vec3 col = mix(shade, lit, l);

    // Baked ambient occlusion (scripts/build-body-mesh.mjs), spread over
    // several rings and kept low in contrast: the soft dark under the chin,
    // in the armpits and between the legs, never speckle.
    float occ = clamp(vAo, 0.0, 1.0) * (1.0 - hollow * 14.0);
    col *= mix(vec3(0.8, 0.805, 0.825), vec3(1.0), occ);
    // The form turns away softly into its outline on the shade side.
    col *= 1.0 - pow(1.0 - ndv, 3.0) * (1.0 - key) * 0.1;

    // The organs, as light: soft ellipsoids on the skin, in model space so
    // they turn with the body, merged so overlaps saturate instead of
    // doubling. Brightest within, falling off softly, breathing in a slow
    // wave that travels outward from the centre.
    float f = 0.0;
    for (int i = 0; i < NB; i++) {
      float w = uR[i].w;
      if (w < 0.002) continue;
      vec3 d = vLocal - uB[i].xyz;
      float c = cos(uB[i].w), s = sin(uB[i].w);
      vec3 q = vec3(c * d.x + s * d.y, c * d.y - s * d.x, d.z) / uR[i].xyz;
      f += w * exp(-dot(q, q) * 2.2);
    }
    float glow = 1.0 - exp(-2.4 * f);
    float breath = 0.72 + 0.28 * sin(1.3 * uTime + 2.6 * glow);
    vec3 tint = mix(uGlowSoft, uGlow, smoothstep(0.25, 1.0, glow));
    col = mix(col, tint, glow * breath * 0.52);
    // Light, not paint: the lit zone carries a little light of its own
    // along the turn of the form.
    col += uGlowSoft * glow * breath * pow(1.0 - ndv, 2.0) * 0.08;

    // Skin: light at the OUTLINE only, meeting the halo drawn outside it.
    // A softer falloff lit every surface turned from the camera, the eye
    // sockets, nostrils and lips included, and read as blue makeup; the
    // steep falloff and the occlusion gate keep it to the silhouette.
    col = mix(col, uGlowSoft, pow(1.0 - ndv, 4.5) * smoothstep(0.55, 0.9, vAo) * uRim * 0.55);

    // The entrance scan: a thin blue band crossing the body.
    float band = exp(-pow((vPos.y - uScan) / 0.01, 2.0));
    col = mix(col, uGlow, band * 0.6);

    gl_FragColor = vec4(min(col, vec3(1.0)), 1.0);
  }
`;

/* The Skin halo: the body again, pushed out along its normals and drawn
   from behind (back faces, behind the body in depth), so only a thin shell
   outside the silhouette shows, light at the skin and fading to nothing. */
const HALO_VERT = /* glsl */ `
  uniform float uInflate;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec4 wp = modelMatrix * vec4(position + normal * uInflate, 1.0);
    vP = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const HALO_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uCamPos, uGlow;
  uniform float uHalo;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    float a = smoothstep(0.0, 0.6, abs(dot(normalize(vN), normalize(uCamPos - vP))));
    gl_FragColor = vec4(uGlow, a * a * 0.42 * uHalo);
  }
`;

/** Decode `/library/body.bin`: header, Int16 positions quantised to the box, Uint16 indices, u8 AO, i16 octahedral normals. */
function decode(buf: ArrayBuffer) {
  const dv = new DataView(buf);
  if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== "RGBD") throw new Error("bad mesh");
  const n = dv.getUint32(4, true);
  const m = dv.getUint32(8, true);
  const min = [0, 1, 2].map((k) => dv.getFloat32(12 + k * 4, true));
  const max = [0, 1, 2].map((k) => dv.getFloat32(24 + k * 4, true));
  const q = new Int16Array(buf, 36, n * 3);
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) {
    const k = i % 3;
    pos[i] = min[k] + ((q[i] + 32768) / 65535) * (max[k] - min[k]);
  }
  const ind = new Uint16Array(buf, 36 + n * 6, m);
  // Baked ambient occlusion, one byte per vertex, when the file carries it.
  const at = 36 + n * 6 + m * 2;
  const ao = buf.byteLength >= at + n ? new Uint8Array(buf, at, n) : new Uint8Array(n).fill(255);
  // The smoothed normals, from the next 4-byte boundary, when the file carries them.
  const nAt = (at + n + 3) & ~3;
  let nrm: Float32Array | null = null;
  if (buf.byteLength >= nAt + n * 4) {
    const o = new Int16Array(buf, nAt, n * 2);
    nrm = new Float32Array(n * 3);
    for (let v = 0; v < n; v++) {
      let x = o[v * 2] / 32767;
      let y = o[v * 2 + 1] / 32767;
      const z = 1 - Math.abs(x) - Math.abs(y);
      if (z < 0) [x, y] = [(1 - Math.abs(y)) * (x < 0 ? -1 : 1), (1 - Math.abs(x)) * (y < 0 ? -1 : 1)];
      const l = Math.hypot(x, y, z) || 1;
      nrm[v * 3] = x / l;
      nrm[v * 3 + 1] = y / l;
      nrm[v * 3 + 2] = z / l;
    }
  }
  return { pos, ind, ao, nrm };
}

export default function BodyFigure3D({
  active,
  labels,
  counts,
  onPick,
}: {
  active: CategorySlug;
  labels: Record<CategorySlug, string>;
  counts?: Record<CategorySlug, number>;
  onPick?: (slug: CategorySlug) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const floorRef = useRef<HTMLSpanElement>(null);
  const spotRefs = useRef<Partial<Record<CategorySlug, HTMLButtonElement | null>>>({});
  const activeRef = useRef(active);
  const homeRef = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  // The frame loop reads this; kept current after each render, never during it.
  useLayoutEffect(() => {
    activeRef.current = active;
  });

  // A new system: a figure turned by hand comes home. The sway is not touched.
  useEffect(() => homeRef.current(), [active]);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    (async () => {
      const [THREE, buf] = await Promise.all([import("three"), fetch("/library/body.bin").then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("mesh"))))]);
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap || disposed) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }
      // 1.5x at most, as the reference: on a retina screen 2x drew 78% more
      // pixels every frame for a figure that reads the same.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      const { pos, ind, ao, nrm } = decode(buf);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("ao", new THREE.BufferAttribute(ao, 1, true));
      geo.setIndex(new THREE.BufferAttribute(ind, 1));
      if (nrm) geo.setAttribute("normal", new THREE.BufferAttribute(nrm, 3));
      else geo.computeVertexNormals();

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const uniforms = {
        uCamPos: { value: new THREE.Vector3() },
        uGlow: { value: new THREE.Color(GLOW) },
        uGlowSoft: { value: new THREE.Color(GLOW_SOFT) },
        uB: { value: Array.from({ length: NB }, (_, i) => (BLOBS[i] ? new THREE.Vector4(BLOBS[i].c[0], BLOBS[i].c[1], BLOBS[i].c[2], (BLOBS[i].a * Math.PI) / 180) : new THREE.Vector4())) },
        uR: { value: Array.from({ length: NB }, (_, i) => (BLOBS[i] ? new THREE.Vector4(BLOBS[i].r[0], BLOBS[i].r[1], BLOBS[i].r[2], 0) : new THREE.Vector4(1, 1, 1, 0))) },
        uTime: { value: 0 },
        uRim: { value: 0 },
        uScan: { value: reduce ? -10 : SCAN_FROM },
        uClav: { value: CLAV.map(([a, b]) => new THREE.Vector4(a[0], a[1], b[0], b[1])) },
        uRotX: { value: new THREE.Vector3(1, 0, 0) },
      };
      const haloUniforms = {
        uCamPos: uniforms.uCamPos,
        uGlow: uniforms.uGlowSoft,
        uHalo: { value: 0 },
        uInflate: { value: HALO },
      };
      const scene = new THREE.Scene();
      const body = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }));
      // The halo is drawn FIRST, in the opaque pass, blending but writing no
      // depth, so the body drawn after it covers it everywhere inside the
      // silhouette. Drawn after the body, the inflated shell showed through
      // every concavity (eye sockets, nostrils, lips, ears) as blue makeup.
      const halo = new THREE.Mesh(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: HALO_VERT,
          fragmentShader: HALO_FRAG,
          uniforms: haloUniforms,
          side: THREE.BackSide,
          transparent: false,
          blending: THREE.CustomBlending,
          blendSrc: THREE.SrcAlphaFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          depthWrite: false,
        })
      );
      halo.renderOrder = -1;
      halo.visible = false;
      scene.add(body, halo);
      const tanHalf = Math.tan((FOV / 2) * (Math.PI / 180));
      const cam = new THREE.PerspectiveCamera(FOV, 1, 0.05, 60);
      const tmp = new THREE.Vector3();
      const nrmV = new THREE.Vector3();
      const toCam = new THREE.Vector3();
      let sized = false;
      let visible = true;
      let width = 1;
      let height = 1;
      let aspect = 1;
      let scanStart = -1;
      let scanDone = reduce;
      let last = 0;
      let clock = 0;

      /** A framing as it lands in this column: wide enough for the head, and no more than HEADROOM above the crown. */
      const view = (s: Frame): Shot => {
        // Wide enough for the shot's own width (the shoulders, or the arms
        // and hands lower down), whatever the column's shape.
        const half = Math.max(s.half, s.w / aspect);
        return { y: Math.min(s.y, H + HEADROOM - half), half };
      };
      // The camera's two easing stages.
      const start = reduce ? SHOTS[activeRef.current] : FULL;
      const lead = { y: start.y, half: start.half };
      const shot = { y: start.y, half: start.half };
      let framed = false;

      // Each system's light: a 0.6s ease-out from wherever it is to its goal.
      const fade = ORDER.map((slug) => {
        const on = slug === activeRef.current ? 1 : 0;
        return { from: on, to: on, t0: 0, w: on };
      });

      // Turning: by hand (drag, arrows) or the sway, which runs on its own clock.
      let yaw = 0;
      let spin = 0;
      let dragging = false;
      let homing = false;
      let homeAt = 0;
      let swayClock = 0;
      let swayAmp = 0;
      const shown = () => yaw + swayAmp * Math.sin((2 * Math.PI * swayClock) / SWAY_PERIOD);
      const rotY = (v: import("three").Vector3, a: number) => {
        const c = Math.cos(a), s = Math.sin(a);
        return v.set(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
      };
      const frameCamera = () => {
        const dist = shot.half / tanHalf;
        cam.position.set(0, shot.y + 0.02 * dist, dist);
        cam.lookAt(0, shot.y, 0);
        cam.updateMatrixWorld();
        uniforms.uCamPos.value.copy(cam.position);
      };
      // Which spots are stepped back, and which carry their label on the left.
      const back: Partial<Record<CategorySlug, boolean>> = {};
      const left: Partial<Record<CategorySlug, boolean>> = {};
      const place = () => {
        const a = shown();
        for (const slug of ORDER) {
          const el = spotRefs.current[slug];
          if (!el) continue;
          rotY(tmp.set(...SPOT[slug]), a);
          toCam.copy(cam.position).sub(tmp).normalize();
          const facing = rotY(nrmV.set(...NORMAL[slug]), a).dot(toCam);
          tmp.project(cam);
          const px = (tmp.x * 0.5 + 0.5) * width;
          const py = (-tmp.y * 0.5 + 0.5) * height;
          // Inside the canvas's unmasked area, with a few pixels of
          // hysteresis so a spot on the edge never flickers.
          const m = back[slug] ? 6 : 0;
          const inFrame = px > width * 0.07 + m && px < width * 0.93 - m && py > height * 0.05 + m && py < height * 0.86 - m;
          const away = facing < 0.02 || !inFrame;
          if (away !== !!back[slug]) {
            back[slug] = away;
            el.toggleAttribute("data-back", away);
          }
          // A spot in the right part of the column carries its label on its left.
          const flip = left[slug] ? px > width * 0.56 : px > width * 0.62;
          if (flip !== !!left[slug]) {
            left[slug] = flip;
            el.toggleAttribute("data-left", flip);
          }
          el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
        }
        // The floor shadow sits under the feet while they are in frame.
        const floor = floorRef.current;
        if (floor) {
          tmp.set(0, 0, 0).project(cam);
          floor.style.top = `${((-tmp.y * 0.5 + 0.5) * height).toFixed(1)}px`;
          floor.style.width = `${((36 * FULL.half) / shot.half).toFixed(2)}%`;
        }
        wrap.classList.toggle("is-close", shot.y - shot.half > 0.03);
      };
      const resize = () => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        // A hidden column measures 0 x 0; keep the last real frame until it has a size.
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        width = w;
        height = h;
        aspect = w / h;
        cam.aspect = aspect;
        cam.updateProjectionMatrix();
        if (!framed) {
          // The first real size: start the camera on the framing as this column shows it.
          const v = view(start);
          lead.y = shot.y = v.y;
          lead.half = shot.half = v.half;
          framed = true;
        }
        sized = true;
        frameCamera();
        place();
        kick();
      };
      const frame = (now: number) => {
        raf = 0;
        if (!visible || !sized) return;
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
        last = now;
        if (!reduce) clock += dt;
        const current = activeRef.current;

        // The lights: each system eases to its goal on its own.
        let fading = false;
        ORDER.forEach((slug, i) => {
          const f = fade[i];
          const goal = slug === current ? 1 : 0;
          if (goal !== f.to) {
            f.from = f.w;
            f.to = goal;
            f.t0 = now;
          }
          const p = reduce ? 1 : Math.min((now - f.t0) / (FADE_S * 1000), 1);
          f.w = f.from + (f.to - f.from) * (1 - (1 - p) * (1 - p));
          if (p < 1) fading = true;
        });
        BLOBS.forEach((b, i) => {
          uniforms.uR.value[i].w = b.w * fade[ORDER.indexOf(b.slug)].w;
        });
        const skin = fade[ORDER.indexOf("skin")].w;
        uniforms.uRim.value = skin;
        haloUniforms.uHalo.value = skin;
        halo.visible = skin > 0.002;
        uniforms.uTime.value = clock;

        // The scan: crown to feet once, each hotspot arriving as it passes.
        if (!scanDone) {
          if (scanStart < 0) scanStart = now;
          const f = Math.min((now - scanStart) / SCAN_MS, 1);
          const e = 1 - Math.pow(1 - f, 3);
          uniforms.uScan.value = SCAN_FROM + (SCAN_TO - SCAN_FROM) * e;
          for (const slug of ORDER) {
            if (uniforms.uScan.value < SPOT[slug][1]) spotRefs.current[slug]?.setAttribute("data-in", "");
          }
          if (f >= 1) {
            uniforms.uScan.value = -10;
            scanDone = true;
          }
        }

        // The camera: the whole figure while the scan runs, then the active
        // system's framing, through two exponential stages.
        const target = view(scanDone ? SHOTS[current] : FULL);
        if (reduce) {
          lead.y = shot.y = target.y;
          lead.half = shot.half = target.half;
        } else {
          const k = 1 - Math.exp(-CAM_K * dt);
          lead.y += (target.y - lead.y) * k;
          lead.half += (target.half - lead.half) * k;
          shot.y += (lead.y - shot.y) * k;
          shot.half += (lead.half - shot.half) * k;
        }

        // Turning: inertia after a hand, then home; the sway always runs on.
        if (!dragging && Math.abs(spin) > 0.0002) {
          yaw += spin;
          spin *= reduce ? 0 : Math.pow(0.9, dt * 60);
        } else if (!dragging && !homing && homeAt && now >= homeAt) {
          homing = true;
          homeAt = 0;
        }
        if (homing && !dragging) {
          spin = 0;
          const home = Math.round(yaw / (Math.PI * 2)) * Math.PI * 2;
          yaw += (home - yaw) * (reduce ? 1 : 1 - Math.exp(-HOME_K * dt));
          if (Math.abs(home - yaw) < 0.0005) {
            yaw = home;
            homing = false;
          }
        }
        if (!dragging && !reduce) swayClock += dt;
        swayAmp += ((scanDone && !reduce ? SWAY_AMP : 0) - swayAmp) * (1 - Math.exp(-0.6 * dt));

        body.rotation.y = shown();
        halo.rotation.y = body.rotation.y;
        uniforms.uRotX.value.set(Math.cos(body.rotation.y), 0, -Math.sin(body.rotation.y));
        frameCamera();
        place();
        renderer.render(scene, cam);
        // Always alive while on screen (the sway, the breathing); a
        // reduced-motion page draws only until its changes settle.
        const settling = fading || homing || homeAt > 0 || Math.abs(target.half - shot.half) > 0.0005 || Math.abs(target.y - shot.y) > 0.0005;
        if (!reduce || settling) raf = requestAnimationFrame(frame);
        else last = 0;
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      homeRef.current = () => {
        if (Math.abs(yaw - Math.round(yaw / (Math.PI * 2)) * Math.PI * 2) > 0.001) {
          spin = 0;
          homeAt = 0;
          homing = true;
        }
        kick();
      };

      let lastX = 0;
      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest(".bf3-spot")) return;
        dragging = true;
        homing = false;
        homeAt = 0;
        spin = 0;
        lastX = e.clientX;
        wrap.setPointerCapture(e.pointerId);
        wrap.classList.add("is-dragging");
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const d = (e.clientX - lastX) * 0.01;
        lastX = e.clientX;
        yaw += d;
        spin = d;
        kick();
      };
      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        wrap.classList.remove("is-dragging");
        if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
        homeAt = performance.now() + HOME_AFTER_MS;
        kick();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        homing = false;
        // An impulse, not a jump: the turn eases out over a moment.
        spin += e.key === "ArrowLeft" ? -0.035 : 0.035;
        homeAt = performance.now() + HOME_AFTER_MS + 400;
        kick();
      };
      wrap.addEventListener("pointerdown", onDown);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerup", onUp);
      wrap.addEventListener("pointercancel", onUp);
      wrap.addEventListener("keydown", onKey);

      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      const io = new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) kick();
      });
      io.observe(wrap);
      if (reduce) for (const slug of ORDER) spotRefs.current[slug]?.setAttribute("data-in", "");
      resize();
      setReady(true);
      cleanup = () => {
        wrap.removeEventListener("pointerdown", onDown);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerup", onUp);
        wrap.removeEventListener("pointercancel", onUp);
        wrap.removeEventListener("keydown", onKey);
        ro.disconnect();
        io.disconnect();
        geo.dispose();
        (body.material as import("three").Material).dispose();
        (halo.material as import("three").Material).dispose();
        renderer.dispose();
      };
    })().catch(() => setFailed(true));
    return () => {
      disposed = true;
      homeRef.current = () => {};
      if (raf) cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  if (failed) return <BodyFigure active={active} labels={labels} onPick={onPick} />;

  return (
    <div
      className={`bf3${ready ? " is-ready" : ""}`}
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label="Body figure. Drag, or use the left and right arrow keys, to turn it."
    >
      <span className="bf3-floor" ref={floorRef} aria-hidden="true" />
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="bf3-spots">
        {ORDER.map((slug) => (
          <button
            key={slug}
            type="button"
            ref={(el) => {
              spotRefs.current[slug] = el;
            }}
            className={`bf3-spot${slug === active ? " is-on" : ""}`}
            onClick={() => onPick?.(slug)}
            aria-label={counts ? `${labels[slug]}, ${counts[slug]} peptides` : labels[slug]}
            aria-current={slug === active ? "true" : undefined}
            style={{ transform: "translate(-999px, -999px)" }}
          >
            <span className="bf3-rings" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="bf3-dot" aria-hidden="true" />
            <span className="bf3-label">
              {labels[slug]}
              {counts && <span className="bf3-n">{counts[slug]}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
