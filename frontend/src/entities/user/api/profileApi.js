import apiClient from "../../../shared/api/client";

/**
 * API клиент для управления профилем специалиста
 * Все методы для работы с личным кабинетом
 */
export const profileApi = {
  /**
   * Получить профиль текущего специалиста
   */
  getProfile: async () => {
    const response = await apiClient.get("/specialist/profile");
    return response.data;
  },

  /**
   * Обновить профиль специалиста
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put("/specialist/profile", profileData);
    return response.data;
  },

  /**
   * Изменить пароль специалиста
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.post(
      "/specialist/change-password",
      passwordData
    );
    return response;
  },

  /**
   * Получить активность специалиста
   */
  getActivity: async () => {
    const response = await apiClient.get("/specialist/activity");
    return response.data;
  },

  /**
   * Получить настройки специалиста
   */
  getSettings: async () => {
    const response = await apiClient.get("/specialist/settings");
    return response.data;
  },

  /**
   * Обновить настройки специалиста
   */
  updateSettings: async (settingsData) => {
    const response = await apiClient.put("/specialist/settings", settingsData);
    return response.data;
  },
};

export default profileApi;
