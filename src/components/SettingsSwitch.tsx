import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface SettingsSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
}

export function SettingsSwitch({
  label,
  description,
  checked,
  onChange,
  icon,
}: SettingsSwitchProps) {
  const [isInit, setIsInit] = useState(false);

  const handleClick = () => {
    setIsInit(true);
    onChange();
  };

  return (
    <button
      className="settings-row"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
    >
      <span className="settings-row__icon">{icon}</span>
      <span className="settings-row__copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <button
        className={`t-toggle settings-toggle ${
          checked ? "settings-toggle--active" : ""
        } ${isInit ? "is-init" : ""}`}
        data-on={checked ? "true" : "false"}
        aria-hidden="true"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="t-toggle-thumb" />
      </button>
    </button>
  );
}
