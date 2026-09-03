/**
 * ProgressCircle
 *
 * A single reusable circular progress component covering both use cases:
 *  - Single value (e.g. a score out of 100)
 *  - Multi-segment breakdown (e.g. HIGH/MEDIUM/LOW prompt counts)
 *
 * Segments are drawn as explicit SVG arc paths computed directly from
 * angles (trigonometry), not the stroke-dasharray/stroke-dashoffset trick.
 * The dasharray technique is fragile for STACKED multi-segment rings —
 * getting the offset sign/direction right depends on subtle conventions
 * that are easy to get wrong and hard to verify without rendering in an
 * actual browser. Explicit arc paths have no such ambiguity: each
 * segment's start/end point is computed directly from its start/end
 * angle, so segments are guaranteed to tile the circle exactly with zero
 * gaps or overlaps, verifiable by simple trigonometry.
 *
 * Usage — single value:
 *   <ProgressCircle value={72} max={100} color="#00e29e" centerLabel="/100" />
 *
 * Usage — multi-segment:
 *   <ProgressCircle
 *     segments={[
 *       { value: counts.HIGH, color: "#00e29e" },
 *       { value: counts.MEDIUM, color: "#e9ba00" },
 *       { value: counts.LOW, color: "#ba1a1a" },
 *     ]}
 *     centerLabel="prompts"
 *   />
 */

// angle 0 = 12 o'clock, increasing clockwise
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  // sweepFlag=1 draws clockwise
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function ProgressCircle({
  value,
  max = 100,
  color = "var(--color-primary)",
  segments,
  size = 80,
  strokeWidth = 8,
  trackColor = "var(--color-outline-variant)",
  centerValue,
  centerLabel,
  centerValueClassName = "font-mono-sm font-black text-[17px] text-on-surface leading-none",
  centerLabelClassName = "font-mono-sm text-[9px] text-on-surface-variant mt-0.5",
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  const resolvedSegments = segments?.length
    ? segments
    : [{ value: value ?? 0, color }];

  const total = segments?.length
    ? resolvedSegments.reduce((sum, s) => sum + (s.value || 0), 0) || 1
    : max;

  const defaultCenterValue = segments?.length
    ? resolvedSegments.reduce((sum, s) => sum + (s.value || 0), 0)
    : (value ?? 0);

  // Build each segment's exact start/end angle from its share of the total.
  // Clamped to 359.99deg instead of a full 360 for a single/last segment,
  // since an SVG arc command can't describe a true full circle (start and
  // end point would coincide) — a hair under 360 renders visually
  // identical to a full ring while staying a valid, drawable arc.
  let angle = 0;
  const arcs = resolvedSegments
    .filter((s) => s.value > 0)
    .map((s) => {
      const sweep = (s.value / total) * 360;
      const startAngle = angle;
      const endAngle = Math.min(angle + sweep, 359.99);
      angle += sweep;
      return { ...s, startAngle, endAngle };
    });

  const isFullSingleRing = arcs.length === 1 && arcs[0].endAngle >= 359.9;

  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {isFullSingleRing ? (
          // A single segment covering (essentially) the whole ring — draw
          // a plain full circle rather than a near-360deg arc, since a
          // full <circle> renders more cleanly than an arc path that's
          // 0.01deg short of closing.
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arcs[0].color}
            strokeWidth={strokeWidth}
          />
        ) : (
          arcs.map((arc, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, arc.startAngle, arc.endAngle)}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeLinecap={segments?.length ? "butt" : "round"}
            />
          ))
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={centerValueClassName}>
          {centerValue ?? defaultCenterValue}
        </span>
        {centerLabel && (
          <span className={centerLabelClassName}>{centerLabel}</span>
        )}
      </div>
    </div>
  );
}
