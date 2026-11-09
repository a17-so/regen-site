#!/usr/bin/env node
/**
 * build-body-mesh.mjs: the library's body figure.
 *
 * Takes the MakeHuman base mesh (CC0 1.0: "The base mesh and proxies ...
 * have been released under CC0", makehuman/LICENSE.md) and its default
 * skeleton and skin weights (also CC0), poses it, and writes:
 *
 *   public/library/body.bin            positions (Int16, quantised to the
 *                                      bounding box) + triangle indices +
 *                                      baked ambient occlusion (u8/vertex) +
 *                                      smoothed normals (Int16 x2/vertex,
 *                                      octahedral)
 *   src/app/lib/data/body-spots.json   one surface point (and its normal)
 *                                      per body system for the hotspots, and
 *                                      the organ each system lights (ZONES)
 *
 * The body: male, young, heavily muscled and lean (see SHAPE), no nipples.
 * The pose: arms lowered from MakeHuman's A-pose to hang at the sides
 * (linear blend skinning, the turn spread over clavicle 20%, shoulder 35%,
 * upper arm 45% so the shoulder rolls instead of kinking), legs brought in
 * 6 degrees each. Units are metres, feet on y = 0, facing +z.
 *
 * Source files are fetched once from a pinned commit into
 * node_modules/.cache/makehuman/. Usage: node scripts/build-body-mesh.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SHA = "a8bc2d54ff0ac92e78ff71431b1023eda42bf482";
const BASE = `https://raw.githubusercontent.com/makehumancommunity/makehuman/${SHA}/makehuman/data`;
const CACHE = path.join(ROOT, "node_modules/.cache/makehuman", SHA);
const FILES = { "base.obj": `${BASE}/3dobjs/base.obj`, "default.mhskel": `${BASE}/rigs/default.mhskel`, "default_weights.mhw": `${BASE}/rigs/default_weights.mhw` };
/* The figure is a MAN: the reference's is a woman, and ours read as a copy
   of it. MakeHuman's gender lives in the ethnic targets (male, young), which
   it mixes a third each by default. The build is a REAL athletic man, the
   reference being an ordinary athletic base mesh ("something like this is
   more practical, I don't like this fictional bullshit"): max muscle at
   average weight at exactly 1 (MakeHuman's own top of the dial, never
   extrapolated), plus a light touch of V-shape, waist, hips and stomach.
   Compared side by side on 2026-11-08 and rejected: the lean
   (minimum-weight) muscle target, which bulges the front of the hips;
   muscle past 1 (1.3 read "fat and disproportionate", wide waist and
   frame); a strong V-taper (0.8 V-shape, 0.7 waist: a comic-book torso).
   Taubin smoothing (SMOOTH) takes the wobble out after. */
/** The visible clavicle line, [sternal end, shoulder end] per side, final
    coordinates: sculpted coarsely into the mesh here and drawn crisply by
    the figure's shader from `body-spots.json`. */
const CLAVICLES = [];
/** Taubin smoothing iterations over the posed, shaped skin. */
const SMOOTH = 3;
const SHAPE = {
  "caucasian-male-young.target": 1 / 3,
  "african-male-young.target": 1 / 3,
  "asian-male-young.target": 1 / 3,
  "universal-male-young-maxmuscle-averageweight.target": 1,
  // A light touch of proportion, toward a real athletic build: a little
  // V, a slightly smaller waist and hips, a flat, toned stomach.
  "torso/torso-vshape-incr.target": 0.28,
  "measure/measure-waist-circ-decr.target": 0.25,
  "hip/hip-scale-horiz-decr.target": 0.18,
  "measure/measure-hips-circ-decr.target": 0.14,
  "stomach/stomach-pregnant-decr.target": 0.21,
  "stomach/stomach-tone-incr.target": 0.21,
};
/* No nipples: the reference's mannequin has none ("nipples aren't shown on
   the model"), and on a porcelain figure they read as two etched marks.
   MakeHuman's nipple targets mark where they are; the patch is filled flat
   after posing (see "No nipples" below). */
const NIPPLES = ["breast/nipple-point-decr.target"];
/** Cache name for a target: its folder folded into the file name. */
const cacheName = (t) => t.replace("/", "__");
for (const t of [...Object.keys(SHAPE), ...NIPPLES]) FILES[cacheName(t)] = `${BASE}/targets/${t.includes("/") ? t : `macrodetails/${t}`}`;
const LEG_IN = 6;
const SPREAD = { clavicle: 0.2, shoulder01: 0.35, upperarm01: 0.45 };
const ARM_TARGET = -75; // degrees from horizontal, shoulder joint to wrist: arms open off the body, not pinned ("very stiff, open his arms more")

fs.mkdirSync(CACHE, { recursive: true });
for (const [name, url] of Object.entries(FILES)) {
  const p = path.join(CACHE, name);
  if (fs.existsSync(p)) continue;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`);
  fs.writeFileSync(p, Buffer.from(await res.arrayBuffer()));
  console.log("fetched", name);
}

const V = []; let group = ""; const faces = [];
const keep = new Set(["body", "helper-l-eye", "helper-r-eye"]);
for (const l of fs.readFileSync(path.join(CACHE, "base.obj"), "utf8").split("\n")) {
  if (l.startsWith("v ")) { const [, x, y, z] = l.trim().split(/\s+/); V.push([+x, +y, +z]); }
  else if (l.startsWith("g ")) group = l.slice(2).trim();
  else if (l.startsWith("f ") && keep.has(group)) {
    const idx = l.trim().split(/\s+/).slice(1).map((t) => parseInt(t.split("/")[0], 10) - 1);
    for (let i = 1; i + 1 < idx.length; i++) faces.push(idx[0], idx[i], idx[i + 1]);
  }
}
// Shape targets move every vertex they list, helpers included, so the joints
// computed below follow the new proportions.
for (const [t, w] of Object.entries(SHAPE)) {
  for (const l of fs.readFileSync(path.join(CACHE, cacheName(t)), "utf8").split("\n")) {
    if (!l || l.startsWith("#")) continue;
    const [i, dx, dy, dz] = l.trim().split(/\s+/).map(Number);
    if (!Number.isFinite(i) || !V[i]) continue;
    V[i][0] += dx * w; V[i][1] += dy * w; V[i][2] += dz * w;
  }
}
const skel = JSON.parse(fs.readFileSync(path.join(CACHE, "default.mhskel"), "utf8"));
const weights = JSON.parse(fs.readFileSync(path.join(CACHE, "default_weights.mhw"), "utf8")).weights;
const J = {};
for (const [name, idx] of Object.entries(skel.joints)) {
  const c = [0, 0, 0];
  for (const i of idx) for (let k = 0; k < 3; k++) c[k] += V[i][k] / idx.length;
  J[name] = c;
}
const bones = skel.bones;
const head = (b) => J[bones[b].head];
const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
/** Rotation by deg about a unit axis through pivot p, as a 3x4 matrix. */
function rotAxis(axis, deg, p) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), t = 1 - c;
  const [x, y, z] = axis;
  const R = [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c];
  const o = [0, 1, 2].map((r) => p[r] - (R[r * 3] * p[0] + R[r * 3 + 1] * p[1] + R[r * 3 + 2] * p[2]));
  return [R[0], R[1], R[2], o[0], R[3], R[4], R[5], o[1], R[6], R[7], R[8], o[2]];
}
const rotZ = (deg, p) => rotAxis([0, 0, 1], deg, p);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mul = (A, B) => [0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => A[r * 4] * B[c] + A[r * 4 + 1] * B[4 + c] + A[r * 4 + 2] * B[8 + c] + (c === 3 ? A[r * 4 + 3] : 0)));
const app = (M, v) => [0, 1, 2].map((r) => M[r * 4] * v[0] + M[r * 4 + 1] * v[1] + M[r * 4 + 2] * v[2] + M[r * 4 + 3]);
const armAngle = (side) => {
  const a = head(`upperarm01.${side}`), b = head(`wrist.${side}`);
  return (Math.atan2(b[1] - a[1], Math.abs(b[0] - a[0])) * 180) / Math.PI;
};
const local = {};
const elbow = {};
const fingers = {};
const ELBOW_KEEP = 18; // a relaxed elbow, not a locked one
for (const side of ["L", "R"]) {
  const sign = side === "L" ? 1 : -1; // .L sits at +x
  const need = ARM_TARGET - armAngle(side);
  for (const [b, f] of Object.entries(SPREAD)) local[`${b}.${side}`] = need * f * sign;
  local[`upperleg01.${side}`] = -LEG_IN * sign;
  // Straighten the elbow: MakeHuman's rest pose bends the forearm forward,
  // which hangs the hands out in front, palms up, once the figure can be
  // turned. Rotate the forearm about its own hinge (upper arm x forearm)
  // until it nearly lines up with the upper arm, keeping a natural 8 degrees.
  const u = norm(sub(head(`lowerarm01.${side}`), head(`upperarm01.${side}`)));
  const f = norm(sub(head(`wrist.${side}`), head(`lowerarm01.${side}`)));
  const bend = (Math.acos(Math.min(1, dot(u, f))) * 180) / Math.PI;
  elbow[side] = { axis: norm(cross(u, f)), deg: -(bend - ELBOW_KEEP) };
  // Relax the hand: MakeHuman's rest hand is flat with straight fingers,
  // which reads robotic. Each finger segment curls toward the palm about
  // its own axis (segment direction x palm normal).
  const W0 = head(`wrist.${side}`);
  let palm = norm(cross(sub(head(`finger2-1.${side}`), W0), sub(head(`finger5-1.${side}`), W0)));
  if (palm[1] > 0) palm = palm.map((v) => -v); // the rest pose's palms face down
  for (let k = 1; k <= 5; k++) {
    const degs = k === 1 ? [3, 5, 4] : [7, 11, 8];
    for (let j = 1; j <= 3; j++) {
      const b = `finger${k}-${j}.${side}`;
      if (!bones[b]) continue;
      const d = norm(sub(J[bones[b].tail], head(b)));
      fingers[b] = { axis: norm(cross(d, palm)), deg: degs[j - 1] };
    }
  }
}
const localM = (b) => {
  const side = b.endsWith(".L") ? "L" : b.endsWith(".R") ? "R" : null;
  if (side && b.startsWith("lowerarm01.")) return rotAxis(elbow[side].axis, elbow[side].deg, head(b));
  if (fingers[b]) return rotAxis(fingers[b].axis, fingers[b].deg, head(b));
  return local[b] ? rotZ(local[b], head(b)) : null;
};
const world = {};
const W = (b) => {
  if (world[b]) return world[b];
  const par = bones[b].parent ? W(bones[b].parent) : I;
  const m = localM(b);
  return (world[b] = m ? mul(par, m) : par);
};
for (const b of Object.keys(bones)) W(b);
const wl = new Map();
for (const [b, list] of Object.entries(weights)) for (const [vi, w] of list) { if (!wl.has(vi)) wl.set(vi, []); wl.get(vi).push([b, w]); }

const used = new Map(); const pos = [];
const ind = faces.map((i) => {
  if (!used.has(i)) {
    used.set(i, pos.length / 3);
    const ws = wl.get(i);
    let p = V[i];
    if (ws) {
      const tot = ws.reduce((s, [, w]) => s + w, 0);
      p = [0, 0, 0];
      for (const [b, w] of ws) { const q = app(world[b] ?? I, V[i]); for (let k = 0; k < 3; k++) p[k] += (q[k] * w) / tot; }
    }
    pos.push(...p);
  }
  return used.get(i);
});
let minY = Infinity; for (let i = 1; i < pos.length; i += 3) minY = Math.min(minY, pos[i]);
const cz = (J["pelvis.L____head"][2] + J["pelvis.R____head"][2]) / 2;
for (let i = 0; i < pos.length; i += 3) { pos[i] /= 10; pos[i + 1] = (pos[i + 1] - minY) / 10; pos[i + 2] = (pos[i + 2] - cz) / 10; }

// Taubin smoothing (lambda / mu): irons the small wobbles the muscle
// targets and the skinning leave in the base mesh's low-poly skin, without
// the shrinkage of plain Laplacian smoothing, so the muscle masses keep
// their size and only the lumps go ("everything looks less honed and
// wobbly"). Uniform weights over the mesh's own edges.
/** Each vertex's one-ring: the skin's own neighbours. */
const NBR = (() => {
  const sets = Array.from({ length: pos.length / 3 }, () => new Set());
  for (let t = 0; t < ind.length; t += 3) for (let j = 0; j < 3; j++) for (let q = 0; q < 3; q++) if (j !== q) sets[ind[t + j]].add(ind[t + q]);
  return sets.map((set) => [...set]);
})();
/** Taubin smoothing of a position array, in place. */
function taubin(a, iters) {
  const nv = a.length / 3;
  const pass = (f) => {
    const d = new Float64Array(a.length);
    for (let v = 0; v < nv; v++) {
      const list = NBR[v];
      if (!list.length) continue;
      for (let k = 0; k < 3; k++) {
        let m = 0;
        for (const u of list) m += a[u * 3 + k];
        d[v * 3 + k] = m / list.length - a[v * 3 + k];
      }
    }
    for (let i = 0; i < a.length; i++) a[i] += f * d[i];
  };
  for (let it = 0; it < iters; it++) { pass(0.5); pass(-0.53); }
}
taubin(pos, SMOOTH);

// No nipples. MakeHuman's nipple targets do not do it on this body: the
// point target at full weight inverts the nipple into a 3mm pit with a
// raised ring (measured), so they only LOCATE it here. A smoothing fill was
// tried next (a thin plate, 600 bi-Laplacian passes) and it settled a hair
// UNDER the pec's dome, which shaded as a small pit: "the nipples are
// inverted now". So the patch is not smoothed, it is REPLACED by the chest
// around it: a least-squares quadric z = f(x, y) is fitted to the skin in a
// ring outside the nipple (FIT_R), and every front-facing vertex inside
// NIPPLE_R[1] is moved onto that surface, fully inside NIPPLE_R[0] and
// fading out to its own position by NIPPLE_R[1]. The pec keeps its curve
// through the patch: no bump, no dimple, no ring.
const NIPPLE_R = [0.026, 0.05];
const FIT_R = [0.05, 0.085];
{
  const nv = pos.length / 3;
  const ids = fs.readFileSync(path.join(CACHE, cacheName(NIPPLES[0])), "utf8").split("\n")
    .filter((l) => l && !l.startsWith("#")).map((l) => +l.trim().split(/\s+/)[0]).filter((i) => used.has(i)).map((i) => used.get(i));
  /** Solves the 6x6 normal equations by Gaussian elimination with pivoting. */
  const solve = (M, y) => {
    const n = y.length;
    const A = M.map((row, i) => [...row, y[i]]);
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
      [A[col], A[piv]] = [A[piv], A[col]];
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = A[r][col] / A[col][col];
        for (let k = col; k <= n; k++) A[r][k] -= f * A[col][k];
      }
    }
    return A.map((row, i) => row[n] / row[i]);
  };
  let count = 0;
  let most = 0;
  for (const side of [1, -1]) {
    const mine = ids.filter((v) => Math.sign(pos[v * 3]) === side);
    if (!mine.length) throw new Error("no nipple vertices");
    const c = [0, 1, 2].map((k) => mine.reduce((s, v) => s + pos[v * 3 + k], 0) / mine.length);
    const basis = (dx, dy) => [1, dx, dy, dx * dx, dx * dy, dy * dy];
    const M = Array.from({ length: 6 }, () => new Array(6).fill(0));
    const y = new Array(6).fill(0);
    let samples = 0;
    for (let v = 0; v < nv; v++) {
      const dx = pos[v * 3] - c[0], dy = pos[v * 3 + 1] - c[1], dz = pos[v * 3 + 2] - c[2];
      const r = Math.hypot(dx, dy);
      // Front skin only: the arm hanging beside the chest sits well behind it.
      if (r < FIT_R[0] || r > FIT_R[1] || dz < -0.03) continue;
      const b = basis(dx, dy);
      for (let i = 0; i < 6; i++) {
        y[i] += b[i] * dz;
        for (let j = 0; j < 6; j++) M[i][j] += b[i] * b[j];
      }
      samples++;
    }
    if (samples < 12) throw new Error(`nipple fit: only ${samples} samples`);
    const q = solve(M, y);
    for (let v = 0; v < nv; v++) {
      const dx = pos[v * 3] - c[0], dy = pos[v * 3 + 1] - c[1], dz = pos[v * 3 + 2] - c[2];
      const r = Math.hypot(dx, dy);
      if (r >= NIPPLE_R[1] || dz < -0.03) continue;
      const k = Math.min(1, Math.max(0, (r - NIPPLE_R[0]) / (NIPPLE_R[1] - NIPPLE_R[0])));
      const w = 1 - k * k * (3 - 2 * k);
      const b = basis(dx, dy);
      const fit = c[2] + b.reduce((s, bi, i) => s + bi * q[i], 0);
      const move = w * (fit - pos[v * 3 + 2]);
      pos[v * 3 + 2] += move;
      most = Math.max(most, Math.abs(move));
      count++;
    }
  }
  console.log(`nipples: ${count} vertices set onto the chest's own surface, largest move ${(most * 1000).toFixed(1)} mm`);
}

// Clavicles ("add proper clavicles"): MakeHuman has no target for them and
// its base skin runs flat over the collarbones. The base mesh is too coarse
// for a crisp bone (vertices ~1.5cm apart), so this sculpt is the broad
// form (and gives the AO bake its hollow); the figure's shader draws the
// crisp ridge from the same line, as a normal perturbation. Sculpted here along the
// skeleton's own clavicle bones (posed, in final coordinates): a soft ridge
// over the bone and the hollow above it (the supraclavicular fossa), both
// pushed along the skin normal on the front of the body only, fading in
// from the sternal end and out into the shoulder. Sizes are a lean adult's:
// a ridge about 1cm wide standing 3mm proud, a hollow 2cm above it.
{
  const nv = pos.length / 3;
  const toFinal = (q) => [q[0] / 10, (q[1] - minY) / 10, (q[2] - cz) / 10];
  const nrm = new Float64Array(pos.length);
  for (let t = 0; t < ind.length; t += 3) {
    const [a, b, c] = [ind[t], ind[t + 1], ind[t + 2]];
    const e1 = [0, 1, 2].map((k) => pos[b * 3 + k] - pos[a * 3 + k]);
    const e2 = [0, 1, 2].map((k) => pos[c * 3 + k] - pos[a * 3 + k]);
    const cr = cross(e1, e2);
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) nrm[v * 3 + k] += cr[k];
  }
  const delta = new Float64Array(pos.length);
  for (const side of ["L", "R"]) {
    const bone = bones[`clavicle.${side}`];
    if (!bone) throw new Error("no clavicle bone");
    const S = toFinal(app(world[`clavicle.${side}`], J[bone.head]));
    const T = toFinal(app(world[`clavicle.${side}`], J[bone.tail]));
    // The skeleton's clavicle ends at the shoulder joint; the visible bone
    // runs on to the point of the shoulder (the acromion), rising a little.
    const A = [S[0] + (T[0] - S[0]) * 1.75, S[1] + (T[1] - S[1]) * 1.75 + 0.014, T[2]];
    CLAVICLES.push([S, A].map((q) => q.map((v) => +v.toFixed(4))));
    const ax = A[0] - S[0], ay = A[1] - S[1];
    const len2 = ax * ax + ay * ay, len = Math.sqrt(len2);
    for (let v = 0; v < nv; v++) {
      const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
      const nl = Math.hypot(nrm[v * 3], nrm[v * 3 + 1], nrm[v * 3 + 2]) || 1;
      const nz = nrm[v * 3 + 2] / nl;
      if (nz < 0.15 || z < S[2] - 0.02) continue; // the front of the body only
      // Position along the bone in the front view, and the signed height
      // above its line.
      const t = ((x - S[0]) * ax + (y - S[1]) * ay) / len2;
      if (t < -0.1 || t > 1.1) continue;
      const above = ((x - S[0]) * -ay + (y - S[1]) * ax) / len * Math.sign(ax || 1);
      const ss = (e0, e1, u) => { const k = Math.min(1, Math.max(0, (u - e0) / (e1 - e0))); return k * k * (3 - 2 * k); };
      const along = ss(-0.05, 0.15, t) * (1 - ss(0.82, 1.02, t));
      // Sized for the base mesh, whose skin here has vertices ~1.5cm apart:
      // a 1cm ridge fell between them and moved 30 vertices.
      const ridge = 0.0042 * Math.exp(-(above ** 2) / (0.014 ** 2));
      const fossa = -0.0045 * ss(0.12, 0.35, t) * (1 - ss(0.7, 0.92, t)) * Math.exp(-((above - 0.03) ** 2) / (0.016 ** 2));
      const d = (ridge + fossa) * along * Math.min(1, (nz - 0.15) / 0.25);
      for (let k = 0; k < 3; k++) delta[v * 3 + k] += (nrm[v * 3 + k] / nl) * d;
    }
  }
  for (let i = 0; i < pos.length; i++) pos[i] += delta[i];
}
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], pos[i + k]); max[k] = Math.max(max[k], pos[i + k]); }

// Ambient occlusion, baked per vertex: how much of the sky each point of
// the skin can see. The figure is a static pose and only ever turns about
// its own vertical axis, so object-space AO is exact at every angle. This is
// what puts the soft dark under the chin, in the armpits, between the arms
// and the flanks and between the legs; without it the porcelain read flat
// ("looks like a shadowless dummy"). Cosine-weighted rays over a uniform
// grid, hits weighted by distance so the dark fades out softly, then
// AO_SMOOTH passes of neighbour smoothing: with four, the ray noise and the
// one-vertex dark spots in the creases read as speckle ("a little too
// etchy"), so the occlusion is spread over several rings, a soft wash.
const AO_SMOOTH = 12;
/** Neighbour-averaging passes over the vertex normals (see NRM). */
const NORMAL_SMOOTH = 2;
const n = pos.length / 3;
// Holes: an edge used by exactly one triangle is an open boundary. The
// body and the eyes are each closed shells apart from the eye sockets the
// eyeballs fill; print the count so a change that tears the skin shows.
{
  const edges = new Map();
  for (let t = 0; t < ind.length; t += 3) for (let j = 0; j < 3; j++) {
    const a = ind[t + j], b = ind[t + ((j + 1) % 3)];
    const k = a < b ? `${a}_${b}` : `${b}_${a}`;
    edges.set(k, (edges.get(k) ?? 0) + 1);
  }
  let open = 0;
  for (const c of edges.values()) if (c === 1) open++;
  console.log(`open edges: ${open}`);
}
const ao = (() => {
  const t0 = Date.now();
  const nt = ind.length / 3;
  const nor = new Float64Array(n * 3);
  for (let t = 0; t < nt; t++) {
    const [a, b, c] = [ind[t * 3], ind[t * 3 + 1], ind[t * 3 + 2]];
    const e1 = [0, 1, 2].map((k) => pos[b * 3 + k] - pos[a * 3 + k]);
    const e2 = [0, 1, 2].map((k) => pos[c * 3 + k] - pos[a * 3 + k]);
    const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) nor[v * 3 + k] += cr[k];
  }
  for (let v = 0; v < n; v++) {
    const l = Math.hypot(nor[v * 3], nor[v * 3 + 1], nor[v * 3 + 2]) || 1;
    for (let k = 0; k < 3; k++) nor[v * 3 + k] /= l;
  }
  // Uniform grid of triangles.
  const CELL = 0.035;
  const lo = [0, 1, 2].map((k) => min[k] - 1e-4);
  const dim = [0, 1, 2].map((k) => Math.max(1, Math.ceil((max[k] + 1e-4 - lo[k]) / CELL)));
  const cells = new Map();
  for (let t = 0; t < nt; t++) {
    const vs = [ind[t * 3], ind[t * 3 + 1], ind[t * 3 + 2]];
    const a0 = [0, 1, 2].map((k) => Math.floor((Math.min(...vs.map((v) => pos[v * 3 + k])) - lo[k]) / CELL));
    const a1 = [0, 1, 2].map((k) => Math.floor((Math.max(...vs.map((v) => pos[v * 3 + k])) - lo[k]) / CELL));
    for (let x = a0[0]; x <= a1[0]; x++) for (let y = a0[1]; y <= a1[1]; y++) for (let z = a0[2]; z <= a1[2]; z++) {
      const key = (x * dim[1] + y) * dim[2] + z;
      let list = cells.get(key);
      if (!list) cells.set(key, (list = []));
      list.push(t);
    }
  }
  const stamp = new Int32Array(nt).fill(-1);
  let rayId = 0;
  const hitTri = (t, o, d, maxT) => {
    const a = ind[t * 3] * 3, b = ind[t * 3 + 1] * 3, c = ind[t * 3 + 2] * 3;
    const e1x = pos[b] - pos[a], e1y = pos[b + 1] - pos[a + 1], e1z = pos[b + 2] - pos[a + 2];
    const e2x = pos[c] - pos[a], e2y = pos[c + 1] - pos[a + 1], e2z = pos[c + 2] - pos[a + 2];
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-12) return Infinity;
    const inv = 1 / det;
    const tx = o[0] - pos[a], ty = o[1] - pos[a + 1], tz = o[2] - pos[a + 2];
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) return Infinity;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const w = (d[0] * qx + d[1] * qy + d[2] * qz) * inv;
    if (w < 0 || u + w > 1) return Infinity;
    const tt = (e2x * qx + e2y * qy + e2z * qz) * inv;
    return tt > 0.002 && tt < maxT ? tt : Infinity;
  };
  // Nearest hit within maxT, walking the grid in order (Amanatides & Woo).
  const cast = (o, d, maxT) => {
    rayId++;
    const c = [0, 1, 2].map((k) => Math.min(dim[k] - 1, Math.max(0, Math.floor((o[k] - lo[k]) / CELL))));
    const step = d.map((v) => (v > 0 ? 1 : -1));
    const tMax = [0, 1, 2].map((k) => (d[k] === 0 ? Infinity : ((lo[k] + (c[k] + (d[k] > 0 ? 1 : 0)) * CELL - o[k]) / d[k])));
    const tDelta = d.map((v) => (v === 0 ? Infinity : CELL / Math.abs(v)));
    let tCell = 0;
    while (tCell < maxT) {
      const list = cells.get((c[0] * dim[1] + c[1]) * dim[2] + c[2]);
      let best = Infinity;
      if (list) for (const t of list) {
        if (stamp[t] === rayId) continue;
        stamp[t] = rayId;
        const h = hitTri(t, o, d, maxT);
        if (h < best) best = h;
      }
      const k = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : tMax[1] < tMax[2] ? 1 : 2;
      // A hit inside this cell is final once the walk has passed it.
      if (best <= tMax[k]) return best;
      tCell = tMax[k];
      c[k] += step[k];
      if (c[k] < 0 || c[k] >= dim[k]) return Infinity;
      tMax[k] += tDelta[k];
    }
    return Infinity;
  };
  const K = 72, REACH = 0.32;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const raw = new Float64Array(n);
  for (let v = 0; v < n; v++) {
    const N = [nor[v * 3], nor[v * 3 + 1], nor[v * 3 + 2]];
    const T = Math.abs(N[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const U = [N[1] * T[2] - N[2] * T[1], N[2] * T[0] - N[0] * T[2], N[0] * T[1] - N[1] * T[0]];
    const ul = Math.hypot(...U); for (let k = 0; k < 3; k++) U[k] /= ul;
    const B = [N[1] * U[2] - N[2] * U[1], N[2] * U[0] - N[0] * U[2], N[0] * U[1] - N[1] * U[0]];
    const o = [0, 1, 2].map((k) => pos[v * 3 + k] + N[k] * 0.003);
    const spin = ((v * 2654435761) % 1000) / 1000 * Math.PI * 2;
    let occ = 0;
    for (let i = 0; i < K; i++) {
      // Cosine-weighted hemisphere, Fibonacci-spaced, turned per vertex.
      const r = Math.sqrt((i + 0.5) / K), phi = i * golden + spin;
      const x = r * Math.cos(phi), y = r * Math.sin(phi), z = Math.sqrt(1 - r * r);
      const d = [0, 1, 2].map((k) => U[k] * x + B[k] * y + N[k] * z);
      const h = cast(o, d, REACH);
      if (h !== Infinity) occ += 1 - Math.pow(h / REACH, 0.6) * 0.8;
    }
    raw[v] = 1 - occ / K;
  }
  // Smooth over the mesh's own neighbours.
  const nb = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < nt; t++) for (let j = 0; j < 3; j++) for (let q = 0; q < 3; q++) if (j !== q) nb[ind[t * 3 + j]].add(ind[t * 3 + q]);
  let cur = raw;
  for (let pass = 0; pass < AO_SMOOTH; pass++) {
    const next = new Float64Array(n);
    for (let v = 0; v < n; v++) {
      let s = cur[v] * 2, w = 2;
      for (const u of nb[v]) { s += cur[u]; w++; }
      next[v] = s / w;
    }
    cur = next;
  }
  console.log(`ao: ${n} vertices, ${K} rays each, ${((Date.now() - t0) / 1000).toFixed(1)}s, mean ${(cur.reduce((a, b) => a + b, 0) / n).toFixed(3)}`);
  return cur;
})();

// Smoothed normals, baked. The area-weighted vertex normals, then averaged
// with their neighbours NORMAL_SMOOTH times: the base mesh's skin carries
// small creases (from the muscle targets and the skinning) that the light
// picked out as etching. Smoothing the normals keeps the silhouette and the
// big forms (the positions do not move) and calms the shading of the small
// ones, a sculpted figure in soft porcelain.
const NRM = (() => {
  let cur = new Float64Array(n * 3);
  for (let t = 0; t < ind.length; t += 3) {
    const [a, b, c] = [ind[t], ind[t + 1], ind[t + 2]];
    const e1 = [0, 1, 2].map((k) => pos[b * 3 + k] - pos[a * 3 + k]);
    const e2 = [0, 1, 2].map((k) => pos[c * 3 + k] - pos[a * 3 + k]);
    const cr = cross(e1, e2);
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) cur[v * 3 + k] += cr[k];
  }
  const unit = (arr) => {
    for (let v = 0; v < n; v++) {
      const l = Math.hypot(arr[v * 3], arr[v * 3 + 1], arr[v * 3 + 2]) || 1;
      for (let k = 0; k < 3; k++) arr[v * 3 + k] /= l;
    }
    return arr;
  };
  unit(cur);
  for (let pass = 0; pass < NORMAL_SMOOTH; pass++) {
    const next = new Float64Array(n * 3);
    for (let v = 0; v < n; v++) for (let k = 0; k < 3; k++) {
      let s = cur[v * 3 + k] * 2;
      for (const u of NBR[v]) s += cur[u * 3 + k];
      next[v * 3 + k] = s;
    }
    cur = unit(next);
  }
  return cur;
})();
/** Octahedral encoding of a unit normal to two signed 16-bit integers. */
function oct(x, y, z) {
  const l1 = Math.abs(x) + Math.abs(y) + Math.abs(z) || 1;
  let u = x / l1, v = y / l1;
  if (z < 0) [u, v] = [(1 - Math.abs(v)) * (u < 0 ? -1 : 1), (1 - Math.abs(u)) * (v < 0 ? -1 : 1)];
  return [Math.round(u * 32767), Math.round(v * 32767)];
}

// Binary: "RGBD", u32 vertices, u32 indices, f32 min[3], f32 max[3], i16
// positions, u16 indices, u8 ambient occlusion per vertex (0..255), then,
// from the next 4-byte boundary, the smoothed normals as i16 octahedral
// pairs.
if (n > 65535) throw new Error("too many vertices for u16 indices");
const NRM_AT = (36 + n * 6 + ind.length * 2 + n + 3) & ~3;
const buf = Buffer.alloc(NRM_AT + n * 4);
buf.write("RGBD", 0, "ascii");
buf.writeUInt32LE(n, 4); buf.writeUInt32LE(ind.length, 8);
for (let k = 0; k < 3; k++) { buf.writeFloatLE(min[k], 12 + k * 4); buf.writeFloatLE(max[k], 24 + k * 4); }
for (let i = 0; i < pos.length; i++) {
  const k = i % 3;
  buf.writeInt16LE(Math.round(((pos[i] - min[k]) / (max[k] - min[k])) * 65535) - 32768, 36 + i * 2);
}
for (let i = 0; i < ind.length; i++) buf.writeUInt16LE(ind[i], 36 + n * 6 + i * 2);
for (let v = 0; v < n; v++) buf.writeUInt8(Math.round(Math.min(1, Math.max(0, ao[v])) * 255), 36 + n * 6 + ind.length * 2 + v);
for (let v = 0; v < n; v++) {
  const [u, w] = oct(NRM[v * 3], NRM[v * 3 + 1], NRM[v * 3 + 2]);
  buf.writeInt16LE(u, NRM_AT + v * 4);
  buf.writeInt16LE(w, NRM_AT + v * 4 + 2);
}
fs.writeFileSync(path.join(ROOT, "public/library/body.bin"), buf);

// The hotspots and the organs they light. Everything is placed on the FRONT
// SURFACE under an (x, y) in final coordinates (+x is the figure's left, the
// viewer's right), found by casting a ray along -z through the skin, so a
// change of shape or pose carries them with it.
/** The front-most surface point under (x, y): its position and smoothed normal. */
function front(x, y) {
  const o = [x === 0 ? 1e-5 : x, y, max[2] + 1];
  let best = null;
  for (let t = 0; t < ind.length; t += 3) {
    const a = ind[t] * 3, b = ind[t + 1] * 3, c = ind[t + 2] * 3;
    const e1x = pos[b] - pos[a], e1y = pos[b + 1] - pos[a + 1], e1z = pos[b + 2] - pos[a + 2];
    const e2x = pos[c] - pos[a], e2y = pos[c + 1] - pos[a + 1], e2z = pos[c + 2] - pos[a + 2];
    // Direction (0, 0, -1): p = d x e2, det = e1 . p.
    const px = e2y, py = -e2x;
    const det = e1x * px + e1y * py;
    if (Math.abs(det) < 1e-14) continue;
    const tx = o[0] - pos[a], ty = o[1] - pos[a + 1], tz = o[2] - pos[a + 2];
    const u = (tx * px + ty * py) / det;
    if (u < 0 || u > 1) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const w = -qz / det;
    if (w < 0 || u + w > 1) continue;
    const tt = (e2x * qx + e2y * qy + e2z * qz) / det;
    if (tt > 0 && (!best || tt < best.t)) best = { t: tt, i: t, u, w };
  }
  if (!best) return null;
  const vs = [ind[best.i], ind[best.i + 1], ind[best.i + 2]];
  const bw = [1 - best.u - best.w, best.u, best.w];
  const nrm = [0, 1, 2].map((k) => vs.reduce((s, v, j) => s + NRM[v * 3 + k] * bw[j], 0));
  const l = Math.hypot(...nrm);
  return { p: [x, y, o[2] - best.t], n: nrm.map((v) => v / l) };
}
/** The centre of the figure's right thigh (x < 0) at height y. */
const thighX = (y) => {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < pos.length; i += 3) if (Math.abs(pos[i + 1] - y) < 0.008 && pos[i] < -0.02) { lo = Math.min(lo, pos[i]); hi = Math.max(hi, pos[i]); }
  return (lo + hi) / 2;
};
/* One hotspot per body system, on the anatomy it stands for, in the order
   the hub lists the systems: top to bottom, so the light walks DOWN the
   body as the list scrolls. The reference's choices, placed on this man. */
const SPOT_AT = {
  brain: [0.022, 1.69], // the front of the cranium at the hairline, just off the midline
  skin: [-0.064, 1.615], // the side of the face in front of the ear, at eye level (the figure's right)
  hormones: [0, 1.458], // the front of the throat: the thyroid
  immune: [0.168, 1.325], // the front of the shoulder at the armpit fold: the axillary nodes (the figure's left)
  heart: [0.038, 1.3], // the left chest, just off the breastbone
  digestive: [0, 1.15], // the upper abdomen on the midline: the stomach
  sexual: [0, 0.905], // the low pelvis on the midline, above the pubic bone
  bones: [thighX(0.61), 0.61], // the figure's right thigh, a hand above the knee
};
/* What each system lights: its organ or tissue, as soft ellipsoids on the
   skin (the figure's shader turns them into light). `at` is the centre's
   (x, y) on the front surface, `r` the radii in metres (x, y, depth), `a` a
   turn in the front plane in degrees (positive tips the bottom toward the
   figure's left), `w` a weight. Skin lights the silhouette in the shader;
   its zone here is only a faint touch at the hotspot. */
const ZONES = {
  brain: [{ at: [0, 1.704], r: [0.056, 0.032, 0.07] }],
  skin: [{ at: SPOT_AT.skin, r: [0.024, 0.03, 0.04], w: 0.35 }],
  hormones: [{ at: [0, 1.453], r: [0.04, 0.034, 0.06] }],
  immune: [
    { at: [0, 1.372], r: [0.019, 0.04, 0.05] },
    { at: [0.163, 1.31], r: [0.024, 0.03, 0.06] },
    { at: [-0.163, 1.31], r: [0.024, 0.03, 0.06] },
  ],
  heart: [
    { at: [0.012, 1.304], r: [0.03, 0.027, 0.06] },
    { at: [0.056, 1.3], r: [0.031, 0.029, 0.06] },
    { at: [0.046, 1.256], r: [0.03, 0.05, 0.06], a: 32 },
  ],
  digestive: [
    { at: [-0.042, 1.168], r: [0.06, 0.036, 0.06], a: -8 },
    { at: [0.045, 1.143], r: [0.04, 0.036, 0.06], a: 25 },
  ],
  sexual: [
    { at: [0, 0.975], r: [0.1, 0.044, 0.07] },
    { at: [0, 0.912], r: [0.076, 0.05, 0.07] },
    { at: [0, 0.852], r: [0.038, 0.04, 0.07] },
  ],
  bones: [
    { at: [0.108, 0.525], r: [0.04, 0.046, 0.05] },
    { at: [-0.108, 0.525], r: [0.04, 0.046, 0.05] },
    { at: [0.1, 0.705], r: [0.05, 0.12, 0.06] },
    { at: [-0.1, 0.705], r: [0.05, 0.12, 0.06] },
  ],
};
const spots = {}, normals = {}, zones = {};
let prevY = Infinity;
for (const [k, [x, y]] of Object.entries(SPOT_AT)) {
  if (y >= prevY) throw new Error(`hotspot ${k} is not below the one before it`);
  prevY = y;
  const hit = front(x, y);
  if (!hit) throw new Error(`hotspot ${k} misses the body`);
  spots[k] = hit.p.map((v) => +v.toFixed(4));
  normals[k] = hit.n.map((v) => +v.toFixed(3));
  zones[k] = ZONES[k].map((z) => {
    const h = front(z.at[0], z.at[1]);
    if (!h) throw new Error(`a ${k} zone misses the body`);
    return { c: h.p.map((v) => +v.toFixed(4)), r: z.r, a: z.a ?? 0, w: z.w ?? 1 };
  });
}
fs.writeFileSync(path.join(ROOT, "src/app/lib/data/body-spots.json"), JSON.stringify({ height: +max[1].toFixed(4), halfWidth: +Math.max(-min[0], max[0]).toFixed(4), spots, normals, zones, clavicles: CLAVICLES }, null, 2) + "\n");
console.log(`body: ${n} vertices, ${ind.length / 3} triangles, ${(buf.length / 1024).toFixed(0)} KB; height ${max[1].toFixed(3)} m`);
console.log(spots);
