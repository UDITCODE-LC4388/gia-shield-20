interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gov-text-heading">{title}</h1>
      {subtitle && <p className="text-sm text-gov-text-body mt-1">{subtitle}</p>}
    </div>
  );
}
