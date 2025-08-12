import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../../../shared/api/auth";
import { profileApi } from "../api/profileApi"; // ДОБАВЛЕНО
import { tokenUtils } from "../../../shared/api/client";
import { initialUserState } from "./types";

/**
 * Store для управления состоянием аутентификации и профиля
 * Использует Zustand с персистентностью
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Состояние
      ...initialUserState,

      // ДОБАВЛЕНО: Состояние профиля
      profile: null,
      profileLoading: false,
      profileError: null,

      // ДОБАВЛЕНО: Состояние активности
      activity: null,
      activityLoading: false,

      // ДОБАВЛЕНО: Состояние настроек
      settings: null,
      settingsLoading: false,

      // Действия
      actions: {
        /**
         * Вход в систему
         */
        login: async (credentials) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authApi.login(credentials);

            if (response.success) {
              const { user, token } = response.data;

              // Сохраняем токен
              tokenUtils.setToken(token);

              // Обновляем состояние
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

              return { success: true, user };
            } else {
              throw new Error(response.message || "Ошибка входа");
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error.message,
            });
            throw error;
          }
        },

        /**
         * Выход из системы
         */
        logout: async () => {
          set({ isLoading: true });

          try {
            // Вызываем API для выхода
            await authApi.logout();
          } catch (error) {
            console.error("Ошибка при выходе:", error);
          } finally {
            // В любом случае очищаем локальное состояние
            tokenUtils.removeToken();
            set({
              ...initialUserState,
              // ДОБАВЛЕНО: Очищаем состояние профиля
              profile: null,
              profileLoading: false,
              profileError: null,
              activity: null,
              activityLoading: false,
              settings: null,
              settingsLoading: false,
            });
          }
        },

        /**
         * Регистрация специалиста
         */
        registerSpecialist: async (registrationData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await authApi.registerSpecialist(registrationData);

            if (response.success) {
              set({
                isLoading: false,
                error: null,
              });
              return { success: true, user: response.data.user };
            } else {
              throw new Error(response.message || "Ошибка регистрации");
            }
          } catch (error) {
            set({
              isLoading: false,
              error: error.message,
            });
            throw error;
          }
        },

        /**
         * Проверка идентификационного номера
         */
        checkIdentificationNumber: async (identificationNumber) => {
          return authApi.checkIdentificationNumber(identificationNumber);
        },

        /**
         * Загрузка данных текущего пользователя
         */
        fetchUser: async () => {
          // Проверяем наличие токена
          if (!tokenUtils.hasToken()) {
            set({ ...initialUserState });
            return;
          }

          set({ isLoading: true });

          try {
            const response = await authApi.getMe();

            if (response.success) {
              set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error("Не удалось загрузить данные пользователя");
            }
          } catch (error) {
            console.error("Ошибка загрузки пользователя:", error);
            // Если токен недействителен, очищаем состояние
            tokenUtils.removeToken();
            set({ ...initialUserState });
          }
        },

        // ДОБАВЛЕНО: Действия для работы с профилем

        /**
         * Загрузить профиль специалиста
         */
        fetchProfile: async () => {
          set({ profileLoading: true, profileError: null });

          try {
            const response = await profileApi.getProfile();

            set({
              profile: response.profile,
              profileLoading: false,
              profileError: null,
            });

            return response;
          } catch (error) {
            set({
              profileLoading: false,
              profileError: error.message,
            });
            throw error;
          }
        },

        /**
         * Обновить профиль специалиста
         */
        updateProfile: async (profileData) => {
          set({ profileLoading: true, profileError: null });

          try {
            const response = await profileApi.updateProfile(profileData);

            // Обновляем как профиль, так и основного пользователя
            set((state) => ({
              profile: response.profile,
              user: { ...state.user, ...response.profile },
              profileLoading: false,
              profileError: null,
            }));

            return response;
          } catch (error) {
            set({
              profileLoading: false,
              profileError: error.message,
            });
            throw error;
          }
        },

        /**
         * Изменить пароль
         */
        changePassword: async (passwordData) => {
          set({ profileLoading: true, profileError: null });

          try {
            const response = await profileApi.changePassword(passwordData);

            set({
              profileLoading: false,
              profileError: null,
            });

            return response;
          } catch (error) {
            set({
              profileLoading: false,
              profileError: error.message,
            });
            throw error;
          }
        },

        /**
         * Загрузить активность специалиста
         */
        fetchActivity: async () => {
          set({ activityLoading: true });

          try {
            const response = await profileApi.getActivity();

            set({
              activity: response,
              activityLoading: false,
            });

            return response;
          } catch (error) {
            set({
              activityLoading: false,
            });
            throw error;
          }
        },

        /**
         * Загрузить настройки
         */
        fetchSettings: async () => {
          set({ settingsLoading: true });

          try {
            const response = await profileApi.getSettings();

            set({
              settings: response,
              settingsLoading: false,
            });

            return response;
          } catch (error) {
            set({
              settingsLoading: false,
            });
            throw error;
          }
        },

        /**
         * Обновить настройки
         */
        updateSettings: async (settingsData) => {
          set({ settingsLoading: true });

          try {
            const response = await profileApi.updateSettings(settingsData);

            set({
              settings: response,
              settingsLoading: false,
            });

            return response;
          } catch (error) {
            set({
              settingsLoading: false,
            });
            throw error;
          }
        },

        /**
         * Очистка ошибок
         */
        clearError: () => {
          set({ error: null, profileError: null });
        },

        /**
         * Инициализация приложения
         */
        initializeAuth: async () => {
          const token = tokenUtils.hasToken();

          if (token) {
            // Если есть токен, пытаемся загрузить данные пользователя
            await get().actions.fetchUser();
          } else {
            // Если токена нет, устанавливаем состояние "не аутентифицирован"
            set({ isAuthenticated: false, isLoading: false });
          }
        },
      },
    }),
    {
      name: "auth-store",
      // Сохраняем только основные данные пользователя, не сохраняем loading состояния
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Селекторы для удобного доступа к данным
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthActions = () => useAuthStore((state) => state.actions);

// ДОБАВЛЕНО: Селекторы для профиля
export const useProfile = () => useAuthStore((state) => state.profile);
export const useProfileLoading = () =>
  useAuthStore((state) => state.profileLoading);
export const useProfileError = () =>
  useAuthStore((state) => state.profileError);
export const useActivity = () => useAuthStore((state) => state.activity);
export const useActivityLoading = () =>
  useAuthStore((state) => state.activityLoading);
export const useSettings = () => useAuthStore((state) => state.settings);
export const useSettingsLoading = () =>
  useAuthStore((state) => state.settingsLoading);

/**
 * Хуки для проверки ролей
 */
export const useIsAdmin = () => {
  return useAuthStore((state) => state.user?.can_access_admin === true);
};

export const useIsSpecialist = () => {
  return useAuthStore(
    (state) =>
      state.user?.role === "specialist" || state.user?.can_access_admin === true
  );
};

export const useCanAccessProfile = () => {
  return useAuthStore((state) => state.user?.can_access_profile === true);
};

export default useAuthStore;
