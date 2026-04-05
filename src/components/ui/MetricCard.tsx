import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: { value: string; positive: boolean };
}

export function MetricCard({ icon: Icon, value, label, trend }: MetricCardProps) {
  return (
    <div className="card-gov-accent">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[32px] font-semibold text-navy leading-none">{value}</p>
          <p className="text-[13px] text-gov-text-body mt-1.5">{label}</p>
        </div>
        <div className="w-10 h-10 rounded-md bg-gov-off-white flex items-center justify-center">
          <Icon size={20} className="text-navy" strokeWidth={1.8} />
        </div>
      </div>
      {trend && (
        <p className={`text-xs mt-3 font-medium ${trend.positive ? "text-gov-success" : "text-gov-danger"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}
