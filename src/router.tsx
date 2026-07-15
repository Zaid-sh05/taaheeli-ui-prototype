import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AuthenticatedAppShell } from "@/components/layout/AuthenticatedAppShell";
import { RoleRouteGuard } from "@/components/layout/RoleRouteGuard";
import { RoleSelectionPage } from "@/features/roleSwitch/RoleSelectionPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { PendingActivationPage } from "@/features/auth/pages/PendingActivationPage";
import { PatientRegistrationPage } from "@/features/registration/PatientRegistrationPage";
import { RolePlaceholderPage } from "@/features/roleSwitch/RolePlaceholderPage";
import { ManagerOverviewPage } from "@/features/manager/ManagerOverviewPage";
import { ManagerRequestsPage } from "@/features/manager/ManagerRequestsPage";
import { ManagerRequestDetailPage } from "@/features/manager/ManagerRequestDetailPage";
import { ManagerPatientsPage } from "@/features/manager/ManagerPatientsPage";
import { ManagerPatientDetailPage } from "@/features/manager/ManagerPatientDetailPage";
import { ManagerEmployeesPage } from "@/features/manager/ManagerEmployeesPage";
import { ManagerEmployeeDetailPage } from "@/features/manager/ManagerEmployeeDetailPage";
import { ManagerReportsPage } from "@/features/manager/ManagerReportsPage";
import { ManagerNotificationsPage } from "@/features/manager/ManagerNotificationsPage";
import { useSession } from "@/context/SessionContext";

function LoginRoute() {
  const { selectedRole } = useSession();

  if (!selectedRole) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "اختر واجهة المستخدم أولًا" }}
      />
    );
  }
  return <LoginPage />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register/patient" element={<PatientRegistrationPage />} />
        <Route path="/pending-activation" element={<PendingActivationPage />} />
      </Route>

      {/* Manager routes */}
      <Route
        element={
          <RoleRouteGuard allowedRole="manager">
            <AuthenticatedAppShell />
          </RoleRouteGuard>
        }
      >
        <Route path="/manager" element={<ManagerOverviewPage />} />
        <Route path="/manager/requests" element={<ManagerRequestsPage />} />
        <Route path="/manager/requests/:id" element={<ManagerRequestDetailPage />} />
        <Route path="/manager/patients" element={<ManagerPatientsPage />} />
        <Route path="/manager/patients/:id" element={<ManagerPatientDetailPage />} />
        <Route path="/manager/employees" element={<ManagerEmployeesPage />} />
        <Route path="/manager/employees/:id" element={<ManagerEmployeeDetailPage />} />
        <Route path="/manager/reports" element={<ManagerReportsPage />} />
        <Route path="/manager/notifications" element={<ManagerNotificationsPage />} />
      </Route>

      {/* Phase B/C/D placeholder routes */}
      <Route
        element={
          <RoleRouteGuard allowedRole="doctor">
            <AuthenticatedAppShell />
          </RoleRouteGuard>
        }
      >
        <Route path="/therapist/*" element={<RolePlaceholderPage />} />
      </Route>
      <Route
        element={
          <RoleRouteGuard allowedRole="admin">
            <AuthenticatedAppShell />
          </RoleRouteGuard>
        }
      >
        <Route path="/admin/*" element={<RolePlaceholderPage />} />
      </Route>
      <Route
        element={
          <RoleRouteGuard allowedRole="patient">
            <AuthenticatedAppShell />
          </RoleRouteGuard>
        }
      >
        <Route path="/patient/*" element={<RolePlaceholderPage />} />
      </Route>
      <Route
        element={
          <RoleRouteGuard allowedRole="parent">
            <AuthenticatedAppShell />
          </RoleRouteGuard>
        }
      >
        <Route path="/family/*" element={<RolePlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
