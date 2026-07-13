import React from "react";

/**
 * HexagonSpinner
 * A hexagonal loader where each vertex (corner) lights up pink in
 * sequence, creating a chasing effect around the shape. Corners rest
 * as small white dots and glow pink one at a time.
 *
 * Props:
 *  - size: pixel size of the SVG viewport (default 64)
 *  - color: the active/glow color (default a pink, #ec4899)
 *  - trackColor: the dim resting outline/ring color (default a soft gray)
 *  - speed: full loop duration in seconds (default 1.8)
 */
export default function HexagonSpinner({
    size = 64,
    color = "#ec4899",
    // trackColor = "#e5d9de", 
    trackColor = "#36454F", 
  speed = 1.8,
  label=""
}) {
  // 6 vertices of a flat-top hexagon inscribed in a 100x100 box
  const cx = 50;
  const cy = 50;
  const r = 20;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 90);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  const vertexDelay = speed / points.length;

  return (
    <div
    //   style={{
    //     display: "inline-flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     width: size,
    //     height: size,
    //   }}
    style={{
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
}}
      role="status"
      aria-label="Loading"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="hexGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* dim resting hexagon outline, connects the vertices */}
        <polygon
          points={points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={trackColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* white vertex dots (base, always visible) */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#ffffff"
            stroke={trackColor}
            strokeWidth="2"
          />
        ))}

        {/* glowing pink dot overlay, animates one vertex at a time */}
        {points.map(([x, y], i) => (
          <circle
            key={`glow-${i}`}
            cx={x}
            cy={y}
            r="4"
            fill={color}
            filter="url(#hexGlow)"
            style={{
              opacity: 0,
              animation: `hex-vertex-pulse ${speed}s ease-in-out infinite`,
              animationDelay: `${i * vertexDelay}s`,
            }}
          />
        ))}
      </svg>
      <span className="text-[#36454F] text-sm font-body-md">
              {label}
            </span>

      <style>{`
        @keyframes hex-vertex-pulse {
          0% { opacity: 0; transform: scale(0.8); }
          8% { opacity: 1; transform: scale(1.15); }
          22% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        circle { transform-origin: center; transform-box: fill-box; }
        @media (prefers-reduced-motion: reduce) {
          circle[filter] { animation: none !important; opacity: 0.35 !important; }
        }
      `}</style>
    </div>
  );
}

/* ---- Demo usage (remove if importing into your own app) ---- */
export function Demo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        background: "#fafafa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <HexagonSpinner size={64} />
        <p style={{ marginTop: 12, color: "#888", fontSize: 13 }}>default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <HexagonSpinner size={96} speed={1.2} />
        <p style={{ marginTop: 12, color: "#888", fontSize: 13 }}>faster / larger</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <HexagonSpinner size={48} color="#f472b6" trackColor="#f3e8eb" />
        <p style={{ marginTop: 12, color: "#888", fontSize: 13 }}>lighter pink</p>
      </div>
    </div>
  );
}