import apiClient from "./client";

export const pagesApi = {
  // Получить все страницы
  getAll: async () => {
    const response = await apiClient.get("/pages");
    return response.data; // Извлекаем data из { success, data }
  },

  // Получить главную страницу
  getHome: async () => {
    const response = await apiClient.get("/pages/home");
    return response.data;
  },

  // Получить страницу по slug
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/pages/${slug}`);
    return response.data;
  },

  // Получить навигацию
  getNavigation: async () => {
    const response = await apiClient.get("/pages/navigation");
    return response.data;
  },

  // Проверить состояние API
  checkHealth: async () => {
    const response = await apiClient.get("/health");
    return response; // Возвращаем весь ответ для health check
  },
};

export default pagesApi;
