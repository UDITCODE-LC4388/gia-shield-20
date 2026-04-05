interface BeneficiaryCardProps {
  name: string;
  aadhaar: string;
  dob: string;
  district: string;
  riskScore: number;
}

export function BeneficiaryCard({ name, aadhaar, dob, district, riskScore }: BeneficiaryCardProps) {
  const scoreColor =
    riskScore >= 70 ? "text-gov-danger" : riskScore >= 40 ? "text-gov-warning" : "text-gov-success";
  const scoreBg =
    riskScore >= 70
      ? "bg-gov-danger/10 border-gov-danger/20"
      : riskScore >= 40
      ? "bg-gov-warning/10 border-gov-warning/20"
      : "bg-gov-success/10 border-gov-success/20";

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  return (
    <div className="card-gov flex gap-5">
      <div className="w-16 h-16 rounded-full bg-gov-off-white flex items-center justify-center text-navy font-semibold text-lg flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gov-text-heading">{name}</h3>
        <div className="grid grid-cols-2 gap-y-1.5 mt-2 text-sm text-gov-text-body">
          <span>Aadhaar: {aadhaar}</span>
          <span>DOB: {dob}</span>
          <span>District: {district}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="section-label">Risk Score</span>
        <div className={`px-4 py-2 rounded-md border ${scoreBg}`}>
          <span className={`text-2xl font-bold ${scoreColor}`}>{riskScore}</span>
          <span className="text-xs text-gov-text-body">/100</span>
        </div>
      </div>
    </div>
  );
}
