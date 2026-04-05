export function AshokChakra({ size = 32, className = "" }: { size?: number; className?: string }) {
  const spokes = 24;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  const innerR = r * 0.3;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="currentColor" strokeWidth="1" />
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * 360) / spokes;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + innerR * Math.cos(rad);
        const y1 = cy + innerR * Math.sin(rad);
        const x2 = cx + r * Math.cos(rad);
        const y2 = cy + r * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />;
      })}
    </svg>
  );
}
