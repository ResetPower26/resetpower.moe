import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { MainLayout } from "./layouts/MainLayout";
import {
  About,
  ArticleDetail,
  Articles,
  ColumnDetail,
  Home,
  Links,
  Projects,
  Tools,
} from "./pages";
import { ArticleEditor } from "./pages/admin/ArticleEditor";
import { AdminArticles } from "./pages/admin/Articles";
import { AdminColumns } from "./pages/admin/Columns";
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminLinks } from "./pages/admin/Links";
import { Login } from "./pages/admin/Login";
import { AdminProjects } from "./pages/admin/Projects";
import { Base64Tool } from "./pages/tools/Base64Tool";
import { HashCalculator } from "./pages/tools/HashCalculator";
import { JsonFormatter } from "./pages/tools/JsonFormatter";
import { UrlEncoder } from "./pages/tools/UrlEncoder";

const ARTICLE_PERMISSIONS = ["all", "articles"];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/articles"
          element={
            <MainLayout>
              <Articles />
            </MainLayout>
          }
        />
        <Route
          path="/articles/:slug"
          element={
            <MainLayout>
              <ArticleDetail />
            </MainLayout>
          }
        />
        <Route
          path="/columns/:id"
          element={
            <MainLayout>
              <ColumnDetail />
            </MainLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <MainLayout>
              <Projects />
            </MainLayout>
          }
        />
        <Route
          path="/links"
          element={
            <MainLayout>
              <Links />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/tools"
          element={
            <MainLayout>
              <Tools />
            </MainLayout>
          }
        />
        <Route
          path="/tools/json-formatter"
          element={
            <MainLayout>
              <JsonFormatter />
            </MainLayout>
          }
        />
        <Route
          path="/tools/base64"
          element={
            <MainLayout>
              <Base64Tool />
            </MainLayout>
          }
        />
        <Route
          path="/tools/hash"
          element={
            <MainLayout>
              <HashCalculator />
            </MainLayout>
          }
        />
        <Route
          path="/tools/url-encoder"
          element={
            <MainLayout>
              <UrlEncoder />
            </MainLayout>
          }
        />

        {/* Admin routes — no MainLayout */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute requiredPermission="all">
              <AdminLayout>
                <AdminProjects />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/links"
          element={
            <ProtectedRoute requiredPermission="all">
              <AdminLayout>
                <AdminLinks />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/columns"
          element={
            <ProtectedRoute requiredPermission="all">
              <AdminLayout>
                <AdminColumns />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles"
          element={
            <ProtectedRoute requiredPermissions={ARTICLE_PERMISSIONS}>
              <AdminLayout>
                <AdminArticles />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/new"
          element={
            <ProtectedRoute requiredPermissions={ARTICLE_PERMISSIONS}>
              <AdminLayout>
                <ArticleEditor />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/articles/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={ARTICLE_PERMISSIONS}>
              <AdminLayout>
                <ArticleEditor />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
