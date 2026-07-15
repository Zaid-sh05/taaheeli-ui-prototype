import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RoleSelectionPage } from "@/features/roleSwitch/RoleSelectionPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { PendingActivationPage } from "@/features/auth/pages/PendingActivationPage";
import { PatientRegistrationPage } from "@/features/registration/PatientRegistrationPage";
import { PlaceholderDashboard } from "@/features/roleSwitch/PlaceholderDashboard";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<RoleSelectionPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register/patient" element={<PatientRegistrationPage />} />
        <Route path="pending-activation" element={<PendingActivationPage />} />
        <Route path="app" element={<PlaceholderDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
