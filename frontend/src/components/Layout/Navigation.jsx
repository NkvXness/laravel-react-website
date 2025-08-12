import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../../hooks/usePages";

const Navigation = ({ isMobile = false, onLinkClick }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { data: navigationData, isLoading, error } = useNavigation();

  // Обработка клика по ссылке
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Проверка активной ссылки
  const isActiveLink = (slug) => {
    if (slug === "home") {
      return location.pathname === "/";
    }
    return location.pathname === `/${slug}`;
  };

  // Базовые классы для ссылок
  const baseLinkClasses = isMobile
    ? "block px-3 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    : "px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Стили для активных и неактивных ссылок
  const getActiveLinkClasses = (isActive) => {
    if (isActive) {
      return `${baseLinkClasses} text-blue-600 bg-blue-50`;
    }
    return `${baseLinkClasses} text-gray-600 hover:text-blue-600 hover:bg-gray-50`;
  };

  if (isLoading) {
    return (
      <div className={isMobile ? "space-y-2" : "flex items-center space-x-4"}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Ошибка загрузки навигации:", error);
    return null;
  }

  return (
    <nav className={isMobile ? "space-y-2" : "flex items-center space-x-4"}>
      {/* Ссылка на главную */}
      <Link
        to="/"
        className={getActiveLinkClasses(isActiveLink("home"))}
        onClick={handleLinkClick}
        aria-current={isActiveLink("home") ? "page" : undefined}
      >
        {t("navigation.home")}
      </Link>

      {/* Динамические ссылки из CMS */}
      {navigationData &&
        navigationData.map((page) => (
          <Link
            key={page.slug}
            to={`/${page.slug}`}
            className={getActiveLinkClasses(isActiveLink(page.slug))}
            onClick={handleLinkClick}
            aria-current={isActiveLink(page.slug) ? "page" : undefined}
          >
            {page.title}
          </Link>
        ))}
    </nav>
  );
};

export default Navigation;
