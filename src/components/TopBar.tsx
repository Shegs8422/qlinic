import { HugeiconsIcon } from "@hugeicons/react";
import {
  StethoscopeIcon,
  ArrowLeft01Icon,
  UserIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";

interface TopBarProps {
  title?: string;
  backTo?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  showActions?: boolean;
}

export function TopBar({
  title,
  backTo,
  onProfile,
  onSettings,
  showActions = true,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-1 min-w-[44px]">
        {backTo ? (
          <button
            className="icon-button"
            aria-label="Go back"
            onClick={() => {
              window.history.back();
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
          </button>
        ) : (
          <div className="wordmark">
            <HugeiconsIcon icon={StethoscopeIcon} size={20} />
            <span>Qlinic</span>
          </div>
        )}
      </div>

      <div className="flex-1 text-center">
        {title && <span className="topbar__title">{title}</span>}
      </div>

      <div className="flex items-center justify-end gap-1.5 min-w-[44px]">
        {showActions && onProfile && (
          <button
            className="icon-button"
            aria-label="Patient Profile"
            onClick={onProfile}
          >
            <HugeiconsIcon icon={UserIcon} size={20} />
          </button>
        )}
        {showActions && onSettings && (
          <button
            className="icon-button"
            aria-label="Settings"
            onClick={onSettings}
          >
            <HugeiconsIcon icon={Settings02Icon} size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
