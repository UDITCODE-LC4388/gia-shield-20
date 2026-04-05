type RiskLevel = "Low" | "Medium" | "High" | "Critical";

interface RiskBadgeProps {
  level: RiskLevel;
}

const riskClasses: Record<RiskLevel, string> = {
  Low: "risk-low",
  Medium: "risk-medium",
  High: "risk-high",
  Critical: "risk-critical",
};

export function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${riskClasses[level]}`}>
      {level.toUpperCase()}
    </span>
  );
}
