import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "@/context/SessionContext";
import { DemoDataProvider } from "@/context/DemoDataContext";
import { TextSizeModeProvider } from "@/context/TextSizeModeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppRouter } from "@/router";

export function App() {
  return (
    <TextSizeModeProvider>
      <DemoDataProvider>
        <SessionProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ToastProvider>
        </SessionProvider>
      </DemoDataProvider>
    </TextSizeModeProvider>
  );
}
