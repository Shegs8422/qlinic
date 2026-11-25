import { HugeiconsIcon } from "@hugeicons/react";
import { Wifi01Icon } from "@hugeicons/core-free-icons";

export function IOSStatusBar() {
  return (
    <div className="ios-status-bar" aria-hidden="true">
      <span className="ios-status-bar__time">9:41</span>
      <div className="ios-status-bar__island" />
      <div className="ios-status-bar__icons">
        <div className="ios-cellular" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <HugeiconsIcon icon={Wifi01Icon} size={15} />
        <div className="ios-battery">
          <div className="ios-battery-fill" />
        </div>
      </div>
    </div>
  );
}
