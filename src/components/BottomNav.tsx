import { Link, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Hospital01Icon,
  Ticket01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { useQueueStore } from "../store/queueStore";
import { useAuthStore } from "../store/authStore";

type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: any;
  badge?: boolean;
};

const items: NavItem[] = [
  { id: "home", label: "Home", to: "/", icon: Home01Icon, badge: false },
  { id: "clinics", label: "Clinics", to: "/clinics", icon: Hospital01Icon, badge: false },
  { id: "queue", label: "Queue", to: "/queue", icon: Ticket01Icon, badge: true },
  { id: "appointments", label: "Bookings", to: "/appointments", icon: Calendar03Icon, badge: true },
];

export function BottomNav() {
  const location = useLocation();
  const queueActive = useQueueStore((s) => s.active);

  return (
    <nav className="bottom-nav-ios27" aria-label="Main navigation">
      {items.map((item) => {
        const isCurrent = location.pathname === item.to;
        return (
          <Link
            key={item.id}
            to={item.to}
            className={`nav-item-ios27 ${isCurrent ? "nav-item-ios27--active" : ""}`}
            aria-current={isCurrent ? "page" : undefined}
          >
            <div className="relative flex items-center justify-center">
              <HugeiconsIcon icon={item.icon} size={20} />
              {item.badge && queueActive && !isCurrent && (
                <span className="t-badge" data-open="true">
                  <span className="t-badge-dot">1</span>
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
