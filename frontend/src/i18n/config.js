import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Переводы
const resources = {
  ru: {
    translation: {
      // Навигация
      navigation: {
        home: "Главная",
        about: "О нас",
        contacts: "Контакты",
      },
      // Общие элементы
      common: {
        loading: "Загрузка...",
        error: "Произошла ошибка",
        notFound: "Страница не найдена",
        backToHome: "Вернуться на главную",
        language: "Язык",
        accessibility: "Версия для слабовидящих",
      },
      // Хлебные крошки
      breadcrumbs: {
        home: "Главная",
      },
      // Админ-панель
      admin: {
        dashboard: "Панель управления",
        pages: "Страницы",
        login: "Войти",
        logout: "Выйти",
      },
    },
  },
  be: {
    translation: {
      // Навігацыя
      navigation: {
        home: "Галоўная",
        about: "Пра нас",
        contacts: "Кантакты",
      },
      // Агульныя элементы
      common: {
        loading: "Загрузка...",
        error: "Адбылася памылка",
        notFound: "Старонка не знойдзена",
        backToHome: "Вярнуцца на галоўную",
        language: "Мова",
        accessibility: "Версія для слабабачных",
      },
      // Хлебныя крошкі
      breadcrumbs: {
        home: "Галоўная",
      },
      // Адмін-панэль
      admin: {
        dashboard: "Панэль кіравання",
        pages: "Старонкі",
        login: "Увайсці",
        logout: "Выйсці",
      },
    },
  },
  en: {
    translation: {
      // Navigation
      navigation: {
        home: "Home",
        about: "About Us",
        contacts: "Contacts",
      },
      // Common elements
      common: {
        loading: "Loading...",
        error: "An error occurred",
        notFound: "Page not found",
        backToHome: "Back to home",
        language: "Language",
        accessibility: "Version for visually impaired",
      },
      // Breadcrumbs
      breadcrumbs: {
        home: "Home",
      },
      // Admin panel
      admin: {
        dashboard: "Dashboard",
        pages: "Pages",
        login: "Login",
        logout: "Logout",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "ru", // язык по умолчанию
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false, // React уже делает escaping
  },
});

export default i18n;
