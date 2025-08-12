import apiClient, { getCsrfToken } from "./client";

/**
 * API клиент для аутентификации
 * Все методы для работы с авторизацией
 */
export const authApi = {
  /**
   * Вход в систему
   */
  login: async (credentials) => {
    // ВАЖНО: Получаем CSRF токен перед аутентификацией
    await getCsrfToken();

    const response = await apiClient.post("/auth/login", credentials);
    // ИСПРАВЛЕНО: убираем лишний .data, так как client.js уже возвращает response.data
    return response;
  },

  /**
   * Выход из системы
   */
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response;
  },

  /**
   * Получить данные текущего пользователя
   */
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    // ИСПРАВЛЕНО: убираем лишний .data
    return response;
  },

  /**
   * Проверить идентификационный номер
   */
  checkIdentificationNumber: async (identificationNumber) => {
    // Получаем CSRF токен для безопасности
    await getCsrfToken();

    const response = await apiClient.post("/auth/check-id", {
      identification_number: identificationNumber,
    });
    return response;
  },

  /**
   * Регистрация специалиста
   */
  registerSpecialist: async (registrationData) => {
    // Получаем CSRF токен перед регистрацией
    await getCsrfToken();

    const response = await apiClient.post(
      "/auth/register-specialist",
      registrationData
    );
    // ИСПРАВЛЕНО: убираем лишний .data
    return response;
  },

  /**
   * Проверить статус аутентификации (тестовый эндпоинт)
   */
  testAuthenticated: async () => {
    const response = await apiClient.get("/test/authenticated");
    return response;
  },

  /**
   * Проверить права специалиста (тестовый эндпоинт)
   */
  testSpecialist: async () => {
    const response = await apiClient.get("/test/specialist");
    return response;
  },

  /**
   * Проверить права админа (тестовый эндпоинт)
   */
  testAdmin: async () => {
    const response = await apiClient.get("/test/admin");
    return response;
  },
};

export default authApi;
