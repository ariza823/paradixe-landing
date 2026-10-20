import { ThemeProvider } from "@features/theme/context/ThemeProvider.tsx";
import { Toaster } from "@molecules/toaster/Toaster.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
