import { useEffect } from "react";
import {
  useAuthActions,
  useAuthLoading,
} from "../../entities/user/model/store";

/**
 * Провайдер аутентификации
 * Инициализирует состояние аутентификации при загрузке приложения
 */
const AuthProvider = ({ children }) => {
  const authActions = useAuthActions();
  const isLoading = useAuthLoading();

  // Инициализация аутентификации при монтировании
  useEffect(() => {
    authActions.initializeAuth();
  }, [authActions]);

  // Показываем загрузку пока инициализируется аутентификация
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* Логотип с анимацией */}
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">М</span>
          </div>

          {/* Спиннер */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>

          {/* Текст */}
          <p className="text-gray-600 text-sm">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
