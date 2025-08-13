import { useState, useEffect } from "react";
import { documentsApi } from "../../../entities/user/api/documentsApi";

/**
 * Хук для загрузки контента специалиста
 * Инкапсулирует логику загрузки, кэширования и состояний
 */
export const useSpecialistContent = (contentType) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Загрузка данных
  const loadContent = async () => {
    if (!contentType) {
      setError("Тип контента не указан");
      setIsLoading(false);
      return;
    }

    // Валидация типа контента
    if (!documentsApi.validateContentType(contentType)) {
      setError(`Недопустимый тип контента: ${contentType}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await documentsApi.getContent(contentType);
      setData(response);
    } catch (err) {
      setError(err.message || "Ошибка загрузки данных");
      console.error("Ошибка загрузки контента:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для принудительного обновления
  const refetch = () => {
    loadContent();
  };

  // Загружаем при изменении типа контента
  useEffect(() => {
    loadContent();
  }, [contentType]);

  // Обработчик успешного скачивания файла
  const handleDownloadSuccess = (file) => {
    // Перезагружаем данные для обновления счетчика скачиваний
    loadContent();
    return `Файл "${file.display_name || file.original_name}" успешно скачан`;
  };

  // Вспомогательные функции для работы с данными
  const getFilteredFiles = (
    searchTerm = "",
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    if (!data?.files) return [];

    let filteredFiles = data.files.filter((file) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        file.display_name?.toLowerCase().includes(searchLower) ||
        file.original_name?.toLowerCase().includes(searchLower) ||
        file.description?.toLowerCase().includes(searchLower)
      );
    });

    // Сортировка
    filteredFiles.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.display_name || a.original_name;
          bValue = b.display_name || b.original_name;
          break;
        case "size":
          aValue = a.file_size;
          bValue = b.file_size;
          break;
        case "downloads":
          aValue = a.download_count;
          bValue = b.download_count;
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredFiles;
  };

  // Получить статистику
  const getStats = () => {
    if (!data) {
      return {
        total_files: 0,
        total_size: 0,
        formatted_size: "0 bytes",
        total_downloads: 0,
      };
    }

    const totalDownloads =
      data.files?.reduce((sum, file) => sum + file.download_count, 0) || 0;

    return {
      ...data.stats,
      total_downloads: totalDownloads,
    };
  };

  // Проверить наличие контента
  const hasContent = () => {
    return data?.content !== null;
  };

  // Проверить наличие файлов
  const hasFiles = () => {
    return data?.files && data.files.length > 0;
  };

  return {
    // Основные данные
    isLoading,
    error,
    data,

    // Действия
    refetch,
    loadContent,
    handleDownloadSuccess,

    // Вспомогательные функции
    getFilteredFiles,
    getStats,
    hasContent,
    hasFiles,

    // Прямой доступ к данным для удобства
    content: data?.content || null,
    files: data?.files || [],
    stats: getStats(),

    // Метаданные
    contentType,
    isValidContentType: documentsApi.validateContentType(contentType),
  };
};

export default useSpecialistContent;
