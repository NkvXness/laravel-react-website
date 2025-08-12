import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings, Home, FileText, Users, LogOut } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";

const AdminLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Топ-бар админ-панели */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип и название */}
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800"
              >
                <Settings className="h-6 w-6" />
                <span>Админ-панель</span>
              </Link>

              {/* Индикатор что мы в админке */}
              <div className="hidden sm:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Режим администратора
                </span>
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex items-center space-x-4">
              {/* Ссылка на публичный сайт */}
              <Link
                to="/"
                className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">На сайт</span>
              </Link>

              {/* Переключатель языков */}
              <LanguageSwitcher />

              {/* Кнопка выхода (заглушка) */}
              <button
                type="button"
                className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                title="Выйти"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Боковое меню */}
          <aside className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("admin.dashboard")}
              </h2>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Общие настройки</span>
                  </Link>
                </li>

                <li>
                  <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-400 rounded-md">
                    <FileText className="h-4 w-4" />
                    <span>{t("admin.pages")}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Шаг 2
                    </span>
                  </div>
                </li>

                <li>
                  <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-400 rounded-md">
                    <Users className="h-4 w-4" />
                    <span>Пользователи</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Шаг 5
                    </span>
                  </div>
                </li>
              </ul>

              {/* Информация о версии */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <p>Версия: 1.0.0 (MVP)</p>
                  <p>Шаг: 1 из 5</p>
                </div>
              </div>
            </nav>
          </aside>

          {/* Основной контент */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
