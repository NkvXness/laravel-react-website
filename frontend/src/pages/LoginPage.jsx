//import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { useIsAuthenticated } from "../entities/user/model/store";
import LoginForm from "../features/auth-login/ui/LoginForm";
import Alert from "../shared/ui/Alert/Alert";

/**
 * Страница входа в систему
 * Pages слой в Feature-Sliced Design
 */
const LoginPage = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();

  // SEO мета-теги
  useDocumentHead({
    title: "Вход в систему - Медицинский центр",
    description:
      "Войдите в систему для доступа к личному кабинету специалиста или админ-панели",
    canonical: `${window.location.origin}/login`,
  });

  // Если пользователь уже авторизован, перенаправляем
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // Сообщение из state (например, после регистрации)
  const successMessage = location.state?.message;

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - брендинг */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative">
        <div className="flex items-center justify-center w-full p-12">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">М</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Медицинский центр</h1>
            <p className="text-xl text-blue-100 mb-8">
              Профессиональная наркологическая помощь
            </p>
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-100">
                  Квалифицированные специалисты с многолетним опытом
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-100">
                  Современные методы диагностики и лечения
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-blue-100">
                  Персональный подход к каждому пациенту
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - форма входа */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Сообщение об успехе */}
          {successMessage && (
            <div className="mb-6">
              <Alert type="success" message={successMessage} />
            </div>
          )}

          {/* Мобильный заголовок */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">М</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Медицинский центр
            </h1>
          </div>

          {/* Форма входа */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LoginForm />
          </div>

          {/* Информация для посетителей */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Для получения информации о наших услугах{" "}
              <a
                href="/"
                className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                перейдите на главную страницу
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
