type BadgeProps = {
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
};

export function Badge({ type }: BadgeProps) {
  const colors = {
    BOOLEAN: "bg-blue-100 text-blue-800 border-blue-200",
    INPUT: "bg-green-100 text-green-800 border-green-200",
    CHECKBOX: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[type]}`}>
      {type}
    </span>
  );
}
