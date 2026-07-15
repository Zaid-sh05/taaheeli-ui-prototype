import { BrowserRouter } from "react-router-dom";
import { RoleProvider } from "@/context/RoleContext";
import { TextSizeModeProvider } from "@/context/TextSizeModeContext";
import { AppRouter } from "@/router";

export function App() {
  return (
    <TextSizeModeProvider>
      <RoleProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </RoleProvider>
    </TextSizeModeProvider>
  );
}
