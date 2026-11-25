import { HugeiconsIcon } from "@hugeicons/react";
import {
  Ticket01Icon,
  Calendar03Icon,
  Hospital01Icon,
  Notification01Icon,
  Location01Icon,
  Globe02Icon,
  SparklesIcon,
  UserIcon,
  HelpCircleIcon,
  Logout01Icon,
  ArrowRight01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { Button } from "../components/Button";
import { SettingsSwitch } from "../components/SettingsSwitch";
import { TopBar } from "../components/TopBar";

export function SettingsScreen() {
  const navigate = useNavigate();
  const {
    language,
  } = useAuthStore();
  const {
    reminders,
    setReminders,
    permissions,
    setPermissions,
    accessibility,
    setAccessibility,
    showLanguageModal,
    showAccessibilityModal,
    setShowLanguageModal,
    setShowAccessibilityModal,
    setShowPersonalDetailsModal,
    setShowHelpModal,
    setShowSignOutModal,
    theme,
    setTheme,
    notify,
  } = useSettingsStore();

  return (
    <>
      <TopBar
        title="Settings"
        backTo="/home"
        showActions={false}
      />
      <main className="content settings-screen">
        <section className="settings-intro">
          <span className="eyebrow">QLINIC PREFERENCES</span>
          <h1>Settings</h1>
          <p>
            Choose how Qlinic keeps you informed and uses this device.
          </p>
        </section>

        <section className="settings-section">
          <h2>Notifications</h2>
          <div className="settings-group">
            <SettingsSwitch
              label="Queue updates"
              description="Turn alerts and estimated wait changes"
              checked={reminders.queue}
              onChange={() =>
                setReminders({ queue: !reminders.queue })
              }
              icon={<HugeiconsIcon icon={Ticket01Icon} size={19} />}
            />
            <SettingsSwitch
              label="Appointment reminders"
              description="Booking confirmations and visit reminders"
              checked={reminders.appointment}
              onChange={() =>
                setReminders({ appointment: !reminders.appointment })
              }
              icon={<HugeiconsIcon icon={Calendar03Icon} size={19} />}
            />
            <SettingsSwitch
              label="Clinic service alerts"
              description="Changes to hours and service availability"
              checked={reminders.clinic}
              onChange={() =>
                setReminders({ clinic: !reminders.clinic })
              }
              icon={<HugeiconsIcon icon={Hospital01Icon} size={19} />}
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Device permissions</h2>
          <div className="settings-group">
            <SettingsSwitch
              label="Push notifications"
              description="Allow Qlinic alerts on this device"
              checked={permissions.notifications}
              onChange={() =>
                setPermissions({ notifications: !permissions.notifications })
              }
              icon={<HugeiconsIcon icon={Notification01Icon} size={19} />}
            />
            <SettingsSwitch
              label="Location"
              description="Sort clinics by distance from you"
              checked={permissions.location}
              onChange={() =>
                setPermissions({ location: !permissions.location })
              }
              icon={<HugeiconsIcon icon={Location01Icon} size={19} />}
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>App preferences</h2>
          <div className="settings-group">
            <button
              className="settings-row"
              onClick={() => setShowLanguageModal(true)}
            >
              <span className="settings-row__icon">
                <HugeiconsIcon icon={Globe02Icon} size={19} />
              </span>
              <span className="settings-row__copy">
                <strong>Language</strong>
                <small>{language === "en" ? "English" : "Kiswahili"}</small>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </button>
            <button
              className="settings-row"
              onClick={() => setShowAccessibilityModal(true)}
            >
              <span className="settings-row__icon">
                <HugeiconsIcon icon={SparklesIcon} size={19} />
              </span>
              <span className="settings-row__copy">
                <strong>Accessibility</strong>
                <small>
                  {accessibility.highContrast
                    ? "High contrast enabled"
                    : "Display and audio options"}
                </small>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </button>
            <button
              className="settings-row"
              onClick={() => {
                const next = theme === "dark" ? "light" : "high-contrast";
                setTheme(next);
                document.documentElement.setAttribute("data-theme", next);
                notify(`Theme: ${next}`);
              }}
            >
              <span className="settings-row__icon">
                <HugeiconsIcon icon={File01Icon} size={19} />
              </span>
              <span className="settings-row__copy">
                <strong>Theme</strong>
                <small>{theme} mode</small>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>Account & support</h2>
          <div className="settings-group">
            <button
              className="settings-row"
              onClick={() => setShowPersonalDetailsModal(true)}
            >
              <span className="settings-row__icon">
                <HugeiconsIcon icon={UserIcon} size={19} />
              </span>
              <span className="settings-row__copy">
                <strong>Personal details</strong>
                <small>Name, email address, and clinic ID</small>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </button>
            <button
              className="settings-row"
              onClick={() => setShowHelpModal(true)}
            >
              <span className="settings-row__icon">
                <HugeiconsIcon icon={HelpCircleIcon} size={19} />
              </span>
              <span className="settings-row__copy">
                <strong>Help & clinic hotlines</strong>
                <small>Support, FAQs, and emergency contacts</small>
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </button>
          </div>
        </section>

        <Button
          variant="danger"
          onClick={() => setShowSignOutModal(true)}
          icon={<HugeiconsIcon icon={Logout01Icon} size={18} />}
        >
          Sign out
        </Button>
      </main>
    </>
  );
}
