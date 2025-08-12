import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import "./i18n/config";
import "./index.css";

// Провайдеры
import AuthProvider from "./app/providers/AuthProvider";

// Компоненты
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./shared/ui/ProtectedRoute/ProtectedRoute";

// Страницы
import HomePage from "./pages/HomePage";
import DynamicPage from "./pages/DynamicPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

// Админ-панель
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Создание React Query клиента
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Компонент загрузки
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Публичные страницы */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path=":slug" element={<DynamicPage />} />
              </Route>

              {/* Страницы аутентификации */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Защищенные маршруты - Админ-панель */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* ИСПРАВЛЕНО: Защищенные маршруты - Личный кабинет специалиста */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireSpecialist={true}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 страница */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
