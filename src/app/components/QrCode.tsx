import type { QrMatrix } from "../lib/qr";

/**
 * The QR, drawn module by module.
 *
 * The library's own SVG is one flat path of hard squares, fine, but it looks
 * like a generated asset. This walks the matrix and emits each module itself,
 * which buys three things worth having:
 *
 *  • Rounded modules with a hairline gap, so the code reads as a field of
 *    pixels rather than a solid block.
 *  • The three finder patterns drawn as proper eyes, a rounded ring with a
 *    rounded pupil, instead of concentric squares of tiny dots.
 *  • Everything is `currentColor`, so the code inherits the ink of whatever
 *    surface it sits on.
 *
 * Scannability is preserved deliberately. Modules stay on their exact grid
 * centres and only shrink by 8% for the gap; the quiet zone is a real 2-module
 * margin. Error-correction level M absorbs the rounding with room to spare.
 */

const GAP = 0.08; // per-module inset, leaves a hairline between neighbours
const RADIUS = 0.34; // corner radius as a fraction of a module
const QUIET = 2; // quiet-zone modules on every side, required to scan

/** The 7×7 finder patterns sit at three corners; they're drawn separately. */
function isFinder(x: number, y: number, size: number): boolean {
  const inTL = x < 7 && y < 7;
  const inTR = x >= size - 7 && y < 7;
  const inBL = x < 7 && y >= size - 7;
  return inTL || inTR || inBL;
}

function Eye({ x, y }: { x: number; y: number }) {
  return (
    <>
      {/* Ring: a 7×7 rounded square outlined at one module wide. */}
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={6}
        height={6}
        rx={1.9}
        ry={1.9}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      />
      {/* Pupil: 3×3, centred. */}
      <rect
        x={x + 2}
        y={y + 2}
        width={3}
        height={3}
        rx={1}
        ry={1}
        fill="currentColor"
      />
    </>
  );
}

export default function QrCode({
  matrix,
  className,
  title = "App Store download QR code",
}: {
  matrix: QrMatrix;
  className?: string;
  title?: string;
}) {
  const { size, bits } = matrix;
  const span = size + QUIET * 2;

  const modules: React.ReactElement[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (bits[y * size + x] !== "1") continue;
      if (isFinder(x, y, size)) continue;
      modules.push(
        <rect
          key={`${x}-${y}`}
          x={x + QUIET + GAP}
          y={y + QUIET + GAP}
          width={1 - GAP * 2}
          height={1 - GAP * 2}
          rx={RADIUS}
          ry={RADIUS}
        />
      );
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      <g fill="currentColor">{modules}</g>
      <g>
        <Eye x={QUIET} y={QUIET} />
        <Eye x={QUIET + size - 7} y={QUIET} />
        <Eye x={QUIET} y={QUIET + size - 7} />
      </g>
    </svg>
  );
}
