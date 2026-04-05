import { AlertTriangle } from "lucide-react";

interface AnomalyItemProps {
  index: number;
  title: string;
  description: string;
  schemeRefs: string[];
}

export function AnomalyItem({ index, title, description, schemeRefs }: AnomalyItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <div className="flex items-start gap-3 flex-1">
        <span className="text-sm font-semibold text-gov-text-body mt-0.5">{index}.</span>
        <AlertTriangle size={18} className="text-gov-danger mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gov-text-heading">{title}</h4>
          <p className="text-sm text-gov-text-body mt-1 leading-relaxed">{description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {schemeRefs.map((scheme) => (
              <span
                key={scheme}
                className="section-label px-2 py-0.5 bg-gov-off-white rounded text-[10px]"
              >
                {scheme}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
