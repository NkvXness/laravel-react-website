import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import pagesApi from "../shared/api/pages";

// Хук для получения всех страниц
export const usePages = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["pages", i18n.language],
    queryFn: pagesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для получения главной страницы
export const useHomePage = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["page", "home", i18n.language],
    queryFn: pagesApi.getHome,
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения страницы по slug
export const usePage = (slug) => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["page", slug, i18n.language],
    queryFn: () => pagesApi.getBySlug(slug),
    enabled: !!slug, // Запрос выполняется только если slug существует
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения навигации
export const useNavigation = () => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["navigation", i18n.language],
    queryFn: pagesApi.getNavigation,
    staleTime: 10 * 60 * 1000, // 10 минут для навигации
  });
};

// Хук для проверки состояния API
export const useApiHealth = () => {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: pagesApi.checkHealth,
    staleTime: 30 * 1000, // 30 секунд
    refetchInterval: 60 * 1000, // Проверять каждую минуту
  });
};
