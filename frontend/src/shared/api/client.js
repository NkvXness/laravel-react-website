import axios from "axios";

// Базовая конфигурация API клиента
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
  withCredentials: true, // ВАЖНО: для работы с куками Sanctum
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Отдельный клиент для получения CSRF токена
const csrfClient = axios.create({
  baseURL: "http://localhost:8000", // ИСПРАВЛЕНО: правильный URL backend
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Получить CSRF токен от Laravel
 */
export const getCsrfToken = async () => {
  try {
    await csrfClient.get("/sanctum/csrf-cookie");
    console.log("CSRF токен получен успешно");
  } catch (error) {
    console.error("Ошибка получения CSRF токена:", error);
    throw error;
  }
};

/**
 * Получить CSRF токен из куков
 */
const getCsrfTokenFromCookies = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Добавляем язык, токен и CSRF токен в каждый запрос
apiClient.interceptors.request.use((config) => {
  // Добавляем язык
  const language = localStorage.getItem("language") || "ru";
  config.params = {
    ...config.params,
    locale: language,
  };

  // Добавляем токен аутентификации если есть
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ВАЖНО: Добавляем CSRF токен в заголовки
  const csrfToken = getCsrfTokenFromCookies();
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }

  return config;
});

// Обработка ответов и ошибок
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);

    // Если токен недействителен, удаляем его
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Если мы не на странице входа, перенаправляем туда
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Обработка ошибки CSRF токена
    if (error.response?.status === 419) {
      throw new Error("CSRF token mismatch.");
    }

    if (error.response) {
      // Сервер ответил с ошибкой
      const message = error.response.data?.message || "Ошибка сервера";
      throw new Error(message);
    } else if (error.request) {
      // Запрос был отправлен, но ответа нет
      throw new Error("Сервер не отвечает");
    } else {
      // Ошибка при настройке запроса
      throw new Error("Ошибка конфигурации запроса");
    }
  }
);

/**
 * Утилиты для работы с токенами
 */
export const tokenUtils = {
  // Сохранить токен
  setToken: (token) => {
    localStorage.setItem("auth_token", token);
  },

  // Получить токен
  getToken: () => {
    return localStorage.getItem("auth_token");
  },

  // Удалить токен
  removeToken: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },

  // Проверить наличие токена
  hasToken: () => {
    return Boolean(localStorage.getItem("auth_token"));
  },
};

export default apiClient;
