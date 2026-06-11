interface FacilityProps {
  icon: React.ReactNode;
  value: string;
  srText?: string;
}

export default function Facility({
  icon,
  value,
  srText,
}: FacilityProps) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="text-brand">{icon}</span>
      {srText && <span className="sr-only">{srText} </span>}
      <span>{value}</span>
    </li>
  );
}