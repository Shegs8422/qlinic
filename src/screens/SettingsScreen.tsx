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
import { useState } from "react";
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

  const [accState, setAccState] = useState<Record<string, boolean>>({
    notifications: false,
    permissions: false,
    preferences: false,
    account: false,
  });

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

        <div className="t-acc" data-open={accState.notifications ? "true" : "false"}>
          <button
            className="t-acc-head"
            aria-expanded={accState.notifications}
            onClick={() =>
              setAccState({ ...accState, notifications: !accState.notifications })
            }
          >
            <span className="t-acc-head__copy">Notifications</span>
            <span className="t-acc-chevron">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6.5L8 10.5L12 6.5" />
              </svg>
            </span>
          </button>
          <div className="t-acc-panel">
            <div className="t-acc-panel-inner">
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
            </div>
          </div>
        </div>

        <div className="t-acc" data-open={accState.permissions ? "true" : "false"}>
          <button
            className="t-acc-head"
            aria-expanded={accState.permissions}
            onClick={() =>
              setAccState({ ...accState, permissions: !accState.permissions })
            }
          >
            <span className="t-acc-head__copy">Device permissions</span>
            <span className="t-acc-chevron">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6.5L8 10.5L12 6.5" />
              </svg>
            </span>
          </button>
          <div className="t-acc-panel">
            <div className="t-acc-panel-inner">
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
            </div>
          </div>
        </div>

        <div className="t-acc" data-open={accState.preferences ? "true" : "false"}>
          <button
            className="t-acc-head"
            aria-expanded={accState.preferences}
            onClick={() =>
              setAccState({ ...accState, preferences: !accState.preferences })
            }
          >
            <span className="t-acc-head__copy">App preferences</span>
            <span className="t-acc-chevron">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6.5L8 10.5L12 6.5" />
              </svg>
            </span>
          </button>
          <div className="t-acc-panel">
            <div className="t-acc-panel-inner">
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
            </div>
          </div>
        </div>

        <div className="t-acc" data-open={accState.account ? "true" : "false"}>
          <button
            className="t-acc-head"
            aria-expanded={accState.account}
            onClick={() =>
              setAccState({ ...accState, account: !accState.account })
            }
          >
            <span className="t-acc-head__copy">Account & support</span>
            <span className="t-acc-chevron">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6.5L8 10.5L12 6.5" />
              </svg>
            </span>
          </button>
          <div className="t-acc-panel">
            <div className="t-acc-panel-inner">
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
            </div>
          </div>
        </div>

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
