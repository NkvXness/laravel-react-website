import { useState } from "react";
import {
  Download,
  FileText,
  Image,
  Archive,
  FileSpreadsheet,
  Eye,
  Calendar,
  HardDrive,
} from "lucide-react";
import Button from "../../../shared/ui/Button/Button";
import { documentsApi } from "../../../entities/user/api/documentsApi";

/**
 * Компонент для отображения и скачивания файла
 * Показывает информацию о файле и предоставляет возможность скачивания
 */
const FileDownload = ({
  file,
  onDownloadSuccess,
  onDownloadError,
  className = "",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Получаем иконку файла в зависимости от типа
  const getFileIcon = () => {
    const iconProps = {
      className: "h-6 w-6",
      "aria-hidden": "true",
    };

    switch (file.file_icon) {
      case "image":
        return <Image {...iconProps} className="h-6 w-6 text-green-500" />;
      case "file-spreadsheet":
        return (
          <FileSpreadsheet {...iconProps} className="h-6 w-6 text-green-600" />
        );
      case "archive":
        return <Archive {...iconProps} className="h-6 w-6 text-orange-500" />;
      default:
        return <FileText {...iconProps} className="h-6 w-6 text-blue-500" />;
    }
  };

  // Обработчик скачивания файла
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await documentsApi.downloadFile(file.id, file.original_name);

      if (onDownloadSuccess) {
        onDownloadSuccess(file);
      }
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);

      if (onDownloadError) {
        onDownloadError(error, file);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start space-x-4">
        {/* Иконка файла */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {getFileIcon()}
          </div>
        </div>

        {/* Информация о файле */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Название файла */}
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {file.display_name || file.original_name}
              </h3>

              {/* Описание файла */}
              {file.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {file.description}
                </p>
              )}

              {/* Метаданные файла */}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <HardDrive className="h-3 w-3 mr-1" />
                  <span>{file.formatted_size}</span>
                </div>

                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{file.download_count} скачиваний</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(file.created_at)}</span>
                </div>

                {/* Расширение файла */}
                {file.extension && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    .{file.extension.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Кнопка скачивания */}
            <div className="ml-4 flex-shrink-0">
              <Button
                variant="primary"
                size="small"
                onClick={handleDownload}
                isLoading={isDownloading}
                leftIcon={<Download className="h-4 w-4" />}
                className="min-w-[100px]"
                aria-label={`Скачать файл ${
                  file.display_name || file.original_name
                }`}
              >
                {isDownloading ? "Скачивание..." : "Скачать"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация (показывается при наведении) */}
      <div className="mt-3 pt-3 border-t border-gray-100 hidden group-hover:block">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-gray-500">Оригинальное имя:</dt>
            <dd className="text-gray-900 font-medium truncate">
              {file.original_name}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">MIME тип:</dt>
            <dd className="text-gray-900 font-mono">{file.mime_type}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default FileDownload;
