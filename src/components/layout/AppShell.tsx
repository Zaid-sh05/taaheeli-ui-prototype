import { Outlet } from "react-router-dom";
import { SkipLink } from "@/components/ui/SkipLink";
import { AppHeader } from "./AppHeader";
import { AppNav } from "./AppNav";
import { AppFooter } from "./AppFooter";
import { MainLandmark } from "./MainLandmark";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <AppHeader />
      <AppNav />
      <MainLandmark>
        <Outlet />
      </MainLandmark>
      <AppFooter />
    </div>
  );
}
