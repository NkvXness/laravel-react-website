import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";
import { usePage } from "../hooks/usePages";

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const slug = location.pathname.slice(1); // Убираем первый слеш

  // Получаем данные страницы, если это не главная
  const { data: pageData } = usePage(slug, {
    enabled: slug !== "",
  });

  // Если мы на главной странице, не показываем хлебные крошки
  if (location.pathname === "/") {
    return null;
  }

  // Создаем массив крошек
  const breadcrumbs = [
    {
      label: t("breadcrumbs.home"),
      path: "/",
      icon: Home,
    },
  ];

  // Добавляем текущую страницу, если она не главная
  if (slug && pageData) {
    breadcrumbs.push({
      label: pageData.title,
      path: location.pathname,
      current: true,
    });
  }

  return (
    <nav
      aria-label={t("common.breadcrumbs") || "Навигация по сайту"}
      className="bg-gray-50 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-gray-400 mx-2"
                  aria-hidden="true"
                />
              )}

              {crumb.current ? (
                <span className="text-gray-500 font-medium" aria-current="page">
                  {crumb.icon && (
                    <crumb.icon
                      className="h-4 w-4 inline mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                >
                  {crumb.icon && (
                    <crumb.icon
                      className="h-4 w-4 inline mr-1"
                      aria-hidden="true"
                    />
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
