import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { Home, Auth, Dashboard, NotFound } from "@/pages";
import { ROUTES } from "@/constants/routes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              {/* Public routes without layout */}
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.AUTH} element={<Auth />} />

              {/* Protected routes with layout */}
              <Route element={<Layout />}>
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
