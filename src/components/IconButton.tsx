import { HugeiconsIcon } from "@hugeicons/react";

interface IconButtonProps {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function IconButton({
  label,
  onClick,
  children,
  className = "",
}: IconButtonProps) {
  return (
    <button
      className={`icon-button ${className}`}
      aria-label={label}
      onClick={onClick}
      title={label}
    >
      {children}
    </button>
  );
}
