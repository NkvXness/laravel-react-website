import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Menu, X, Eye, LogIn, LogOut, User, Settings } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import Navigation from "./Navigation";
import AccessibilityPanel from "../AccessibilityPanel";
import {
  useIsAuthenticated,
  useUser,
  useAuthActions,
} from "../../entities/user/model/store";
import { userHelpers } from "../../entities/user/model/types";

const Header = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Данные аутентификации
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const authActions = useAuthActions();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authActions.logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">М</span>
              </div>
              <span className="hidden sm:block">Медицинский центр</span>
            </Link>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-6">
            <Navigation />
          </div>

          {/* Правая часть хедера */}
          <div className="flex items-center space-x-4">
            {/* Кнопка версии для слабовидящих */}
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={t("common.accessibility")}
              title={t("common.accessibility")}
            >
              <Eye className="h-5 w-5" />
            </button>

            {/* Переключатель языков */}
            <LanguageSwitcher />

            {/* Блок аутентификации */}
            {isAuthenticated ? (
              /* Пользователь авторизован */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {userHelpers.getInitials(user)}
                  </div>
                  <span className="hidden sm:block">
                    {userHelpers.getFullName(user)}
                  </span>
                </button>

                {/* Выпадающее меню пользователя */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <div className="py-2">
                      {/* Информация о пользователе */}
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {userHelpers.getFullName(user)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userHelpers.getRoleLabel(user)}
                        </p>
                      </div>

                      {/* Ссылки меню */}
                      {userHelpers.canAccessProfile(user) && (
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Личный кабинет</span>
                        </Link>
                      )}

                      {userHelpers.canAccessAdmin(user) && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Админ-панель</span>
                        </Link>
                      )}

                      {/* Разделитель */}
                      <div className="border-t border-gray-200 my-1"></div>

                      {/* Выход */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Пользователь не авторизован */
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Войти</span>
                </Link>
              </div>
            )}

            {/* Мобильное меню */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Открыть меню"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <Navigation isMobile={true} onLinkClick={closeMobileMenu} />

            {/* Мобильная аутентификация */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {userHelpers.getFullName(user)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userHelpers.getRoleLabel(user)}
                    </p>
                  </div>

                  {userHelpers.canAccessProfile(user) && (
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Личный кабинет
                    </Link>
                  )}

                  {userHelpers.canAccessAdmin(user) && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Админ-панель
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                  onClick={closeMobileMenu}
                >
                  Войти в систему
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Панель доступности */}
      {isAccessibilityOpen && (
        <AccessibilityPanel
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
