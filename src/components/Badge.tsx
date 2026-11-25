type BadgeTone = "neutral" | "success" | "danger" | "light";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span className={`badge badge--${tone} ${className}`}>{children}</span>
  );
}
