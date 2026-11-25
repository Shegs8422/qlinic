import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

interface NoticeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Notice({
  children,
  icon,
  className = "",
}: NoticeProps) {
  return (
    <div className={`notice ${className}`}>
      {icon || <HugeiconsIcon icon={AlertCircleIcon} size={18} />}
      <div>{children}</div>
    </div>
  );
}
