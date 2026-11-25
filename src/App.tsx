import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { Snackbar } from "./components/Snackbar";
import { Modals } from "./components/Modals";
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingIntro } from "./screens/OnboardingIntro";
import { OnboardingProof } from "./screens/OnboardingProof";
import { OnboardingSteps } from "./screens/OnboardingSteps";
import { AuthScreen } from "./screens/AuthScreen";
import { PhoneScreen } from "./screens/PhoneScreen";
import { OtpScreen } from "./screens/OtpScreen";
import { ProfileSetup } from "./screens/ProfileSetup";
import { PermissionsScreen } from "./screens/PermissionsScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ClinicsScreen } from "./screens/ClinicsScreen";
import { ClinicDetailScreen } from "./screens/ClinicDetailScreen";
import { ServiceScreen } from "./screens/ServiceScreen";
import { QueueConfirmScreen } from "./screens/QueueConfirmScreen";
import { QueueScreen } from "./screens/QueueScreen";
import { AppointmentsScreen } from "./screens/AppointmentsScreen";
import { BookingScreen } from "./screens/BookingScreen";
import { AppointmentConfirmScreen } from "./screens/AppointmentConfirmScreen";
import { AppointmentDetailScreen } from "./screens/AppointmentDetailScreen";
import { VisitPrepScreen } from "./screens/VisitPrepScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { useSettingsStore } from "./store/settingsStore";
import { useQueueStore } from "./store/queueStore";
import "./theme/tokens.css";

const mainScreens = [
  "/",
  "/clinics",
  "/queue",
  "/appointments",
];

export default function App() {
  const [screen, setScreen] = useState<"splash" | "app">("splash");
  const [loading, setLoading] = useState(true);
  const { theme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (screen !== "splash") return;
    const timer = setTimeout(() => setScreen("app"), 1500);
    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      // Wait for splash to finish, then allow data to load
      if (screen === "splash") return;
      // Small delay to ensure UI is mounted before hiding loader
      await new Promise((r) => setTimeout(r, 300));
      if (active) setLoading(false);
    };
    init();
    return () => {
      active = false;
    };
  }, [screen]);

  const location = useLocation();
  const isMainScreen = mainScreens.includes(location.pathname);

  if (loading) {
    return (
      <div className="loading-overlay">
        <span class="t-shimmer loading-text" data-text="Loading Qlinic">
          Loading Qlinic
        </span>
      </div>
    );
  }

  if (screen === "splash") {
    return <SplashScreen onStart={() => setScreen("app")} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/clinics" element={<ClinicsScreen />} />
        <Route path="/clinic/:id" element={<ClinicDetailScreen />} />
        <Route path="/service" element={<ServiceScreen />} />
        <Route path="/queue-confirm" element={<QueueConfirmScreen />} />
        <Route path="/queue" element={<QueueScreen />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
        <Route path="/booking" element={<BookingScreen />} />
        <Route path="/appointment-confirm" element={<AppointmentConfirmScreen />} />
        <Route path="/appointment" element={<AppointmentDetailScreen />} />
        <Route path="/visit-prep" element={<VisitPrepScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/onboarding-intro" element={<OnboardingIntro />} />
        <Route path="/onboarding-proof" element={<OnboardingProof />} />
        <Route path="/onboarding-steps" element={<OnboardingSteps />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/sign-in" element={<PhoneScreen />} />
        <Route path="/sign-up" element={<OtpScreen />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/permissions" element={<PermissionsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isMainScreen && <BottomNav />}

      <Snackbar />
      <Modals />
    </>
  );
}
