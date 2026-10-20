import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@layout/Layout.tsx";
import HomePage from "@features/home/pages/HomePage.tsx";
import { PageLoader } from "./components/PageLoader.tsx";
import { ScrollManager } from "./utils/ScrollManager.tsx";

const JewelryPage = lazy(() => import("@features/jewelry/pages/JewelryPage.tsx"));
const AdminPage = lazy(() => import("@features/admin/pages/AdminPage.tsx"));
const NotFoundPage = lazy(() => import("./components/NotFoundPage.tsx"));

const adminPath = ((import.meta.env["VITE_ADMIN_PATH"] as string | undefined) ?? "admin").replace(/^\/+/, "") || "admin";

function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="joyeria" element={<JewelryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path={adminPath} element={<AdminPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default AppRoutes;
