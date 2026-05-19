import { AuthCheck } from "@/types";

type Condition = NonNullable<AuthCheck["condition"]>;

const CONFIG: Record<Condition, { label: string; bg: string; border: string; text: string }> = {
  "new":            { label: "NEW",            bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  "like-new":       { label: "LIKE NEW",       bg: "#f0fdfa", border: "#99f6e4", text: "#0d9488" },
  "lightly-used":   { label: "LIGHTLY USED",   bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  "moderately-used":{ label: "MODERATELY USED",bg: "#fffbeb", border: "#fde68a", text: "#b45309" },
  "heavily-worn":   { label: "HEAVILY WORN",   bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" },
};

interface Props {
  condition: Condition;
}

export default function ConditionBadge({ condition }: Props) {
  const cfg = CONFIG[condition];
  if (!cfg) return null;

  return (
    <span
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.text }}
      className="inline-flex items-center border rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-syne"
    >
      {cfg.label}
    </span>
  );
}
