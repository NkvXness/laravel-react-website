import { Navigate, useLocation } from "react-router-dom";
import {
  useIsAuthenticated,
  useAuthLoading,
  useUser,
} from "../../../entities/user/model/store";
import { userHelpers } from "../../../entities/user/model/types";

/**
 * Компонент для защищенных маршрутов
 * Проверяет аутентификацию и права доступа
 */
const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireSpecialist = false,
  fallbackPath = "/login",
}) => {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const user = useUser();
  const location = useLocation();

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Если не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Проверяем права админа
  if (requireAdmin && !userHelpers.canAccessAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Доступ запрещен
          </h2>
          <p className="text-gray-600 mb-4">
            У вас нет прав для доступа к этой странице. Требуются права
            администратора.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  // Проверяем права специалиста
  if (requireSpecialist && !userHelpers.canAccessProfile(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Доступ для специалистов
          </h2>
          <p className="text-gray-600 mb-4">
            Эта страница доступна только специалистам медицинского центра.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  // Если все проверки пройдены, рендерим дочерние компоненты
  return children;
};

export default ProtectedRoute;
