import apiClient from "../../../shared/api/client";

/**
 * Унифицированный API клиент для управления документами специалиста
 * Использует новые параметризованные эндпоинты backend
 */
export const documentsApi = {
  /**
   * УНИФИЦИРОВАННЫЙ: Получить контент по типу
   * Заменяет getLegislationContent() и getInformationContent()
   */
  getContent: async (type) => {
    const response = await apiClient.get(`/specialist/content/${type}`);
    return response.data;
  },

  /**
   * Получить все контенты специалиста
   */
  getAllContent: async () => {
    const response = await apiClient.get("/specialist/content");
    return response.data;
  },

  /**
   * Получить файлы по типу контента
   */
  getFilesByType: async (contentType) => {
    const response = await apiClient.get(
      `/specialist/files/by-type/${contentType}`
    );
    return response.data;
  },

  /**
   * Получить все файлы специалиста
   */
  getAllFiles: async () => {
    const response = await apiClient.get("/specialist/files");
    return response.data;
  },

  /**
   * НОВЫЙ: Получить статистику файлов
   */
  getFilesStats: async () => {
    const response = await apiClient.get("/specialist/files/stats");
    return response.data;
  },

  /**
   * Получить информацию о конкретном файле
   */
  getFileInfo: async (fileId) => {
    const response = await apiClient.get(`/specialist/files/${fileId}`);
    return response.data;
  },

  /**
   * Получить URL для скачивания файла
   */
  getDownloadUrl: (fileId) => {
    const baseUrl = apiClient.defaults.baseURL.replace("/api/v1", "");
    return `${baseUrl}/api/v1/specialist/files/${fileId}/download`;
  },

  /**
   * Скачать файл через прямую ссылку
   * Улучшенная версия без создания Blob
   */
  downloadFile: async (fileId, fileName) => {
    try {
      // Используем прямую ссылку вместо создания Blob
      const downloadUrl = documentsApi.getDownloadUrl(fileId);

      // Создаем скрытую ссылку для скачивания
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = "none";

      // Добавляем в DOM, кликаем и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);
      throw error;
    }
  },

  /**
   * Альтернативный метод скачивания через fetch (для особых случаев)
   */
  downloadFileBlob: async (fileId, fileName) => {
    try {
      const response = await apiClient.get(
        `/specialist/files/${fileId}/download`,
        {
          responseType: "blob",
        }
      );

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);
      throw error;
    }
  },

  /**
   * Получить иконку файла по типу
   */
  getFileIcon: (mimeType) => {
    const iconMap = {
      // Документы
      "application/pdf": "file-text",
      "application/msword": "file-text",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "file-text",

      // Таблицы
      "application/vnd.ms-excel": "file-spreadsheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "file-spreadsheet",

      // Изображения
      "image/jpeg": "image",
      "image/png": "image",
      "image/gif": "image",
      "image/svg+xml": "image",

      // Архивы
      "application/zip": "archive",
      "application/x-rar-compressed": "archive",

      // Текст
      "text/plain": "file-text",
    };

    return iconMap[mimeType] || "file";
  },

  /**
   * Форматировать размер файла
   */
  formatFileSize: (bytes) => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return bytes + " bytes";
  },

  /**
   * Проверить, является ли файл изображением
   */
  isImage: (mimeType) => {
    return mimeType.startsWith("image/");
  },

  /**
   * Проверить, является ли файл документом
   */
  isDocument: (mimeType) => {
    const documentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    return documentTypes.includes(mimeType);
  },

  /**
   * Валидация типов контента
   */
  validateContentType: (type) => {
    const validTypes = ["legislation", "information"];
    return validTypes.includes(type);
  },

  /**
   * Получить переводы типов контента
   */
  getContentTypeTranslations: () => {
    return {
      legislation: {
        ru: "Законодательство",
        be: "Заканадаўства",
        en: "Legislation",
      },
      information: {
        ru: "Информация",
        be: "Інфармацыя",
        en: "Information",
      },
    };
  },
};

export default documentsApi;
