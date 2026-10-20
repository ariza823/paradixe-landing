import { useEffect } from "react";
import { useAuth } from "@features/auth/context/AuthContext.tsx";
import { AuthProvider } from "@features/auth/context/AuthProvider.tsx";
import { LoginPanel } from "@features/auth/components/LoginPanel.tsx";
import { useDocumentTitle } from "@core/hooks/useDocumentTitle.ts";
import { PageLoader } from "@/routes/components/PageLoader.tsx";
import { AdminTopBar } from "../components/AdminTopBar.tsx";
import { AdminDashboardTemplate } from "../templates/AdminDashboardTemplate.tsx";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

function AdminGate() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAdmin) return <LoginPanel />;

  return (
    <>
      <AdminTopBar />
      <main>
        <AdminDashboardTemplate />
      </main>
    </>
  );
}

function AdminPage() {
  useDocumentTitle("Panel — Paradixe Urban");
  useNoIndex();

  return (
    <AuthProvider>
      <AdminGate />
    </AuthProvider>
  );
}

export default AdminPage;
