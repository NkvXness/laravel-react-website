import { useState } from "react";
import { FileText, Search, Filter, AlertCircle, Loader2 } from "lucide-react";
import FileDownload from "../../file-download/ui/FileDownload";
import Button from "../../../shared/ui/Button/Button";
import Input from "../../../shared/ui/Input/Input";
import Alert from "../../../shared/ui/Alert/Alert";
import useSpecialistContent from "../hooks/useSpecialistContent";

/**
 * Упрощенный компонент для просмотра документов специалиста
 * Использует хук useSpecialistContent для загрузки данных
 */
const DocumentViewer = ({
  contentType,
  title,
  description,
  emptyMessage = "Документы пока не загружены",
  className = "",
}) => {
  // Состояние поиска и сортировки
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Используем хук для загрузки данных
  const {
    isLoading,
    error,
    content,
    hasContent,
    hasFiles,
    stats,
    getFilteredFiles,
    handleDownloadSuccess: hookHandleDownloadSuccess,
    refetch,
  } = useSpecialistContent(contentType);

  // Обработчик успешного скачивания
  const handleDownloadSuccess = (file) => {
    const message = hookHandleDownloadSuccess(file);
    setDownloadSuccess(message);

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3000);
  };

  // Обработчик ошибки скачивания
  const handleDownloadError = (error, file) => {
    console.error(
      `Ошибка скачивания файла "${file.display_name || file.original_name}":`,
      error
    );
  };

  // Получаем отфильтрованные файлы
  const filteredFiles = getFilteredFiles(searchTerm, sortBy, sortOrder);

  // Загрузка
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-8 ${className}`}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Загрузка документов
          </h3>
          <p className="text-gray-600">Пожалуйста, подождите...</p>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className={`${className}`}>
        <Alert
          type="error"
          title="Ошибка загрузки"
          message={error}
          dismissible
          onClose={() => refetch()}
        />
        <div className="mt-4 text-center">
          <Button onClick={refetch} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Уведомление об успешном скачивании */}
      {downloadSuccess && (
        <Alert
          type="success"
          message={downloadSuccess}
          dismissible
          onClose={() => setDownloadSuccess(null)}
        />
      )}

      {/* Заголовок и описание */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        {description && (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}

        {/* Информация о контенте */}
        {hasContent() && content && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">{content.title}</h3>
            {content.description && (
              <p className="text-blue-800 text-sm">{content.description}</p>
            )}
            {content.content && (
              <div
                className="mt-3 text-blue-900 text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            )}
          </div>
        )}

        {/* Статистика */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total_files}
            </div>
            <div className="text-sm text-gray-600">Всего файлов</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.formatted_size}
            </div>
            <div className="text-sm text-gray-600">Общий размер</div>
          </div>
        </div>
      </div>

      {/* Файлы */}
      {hasFiles() ? (
        <>
          {/* Поиск и сортировка */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              {/* Поиск */}
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Поиск по названию файла..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                />
              </div>

              {/* Сортировка */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="created_at-desc">Новые сначала</option>
                  <option value="created_at-asc">Старые сначала</option>
                  <option value="name-asc">По имени (А-Я)</option>
                  <option value="name-desc">По имени (Я-А)</option>
                  <option value="size-desc">Большие сначала</option>
                  <option value="size-asc">Маленькие сначала</option>
                  <option value="downloads-desc">Популярные сначала</option>
                </select>
              </div>
            </div>

            {/* Счетчик найденных файлов */}
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                Найдено файлов: {filteredFiles.length} из {stats.total_files}
              </div>
            )}
          </div>

          {/* Список файлов */}
          <div className="space-y-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <FileDownload
                  key={file.id}
                  file={file}
                  onDownloadSuccess={handleDownloadSuccess}
                  onDownloadError={handleDownloadError}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Файлы не найдены
                </h3>
                <p className="text-gray-600">
                  Попробуйте изменить поисковый запрос или очистить фильтры
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-4"
                >
                  Очистить поиск
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Пустое состояние */
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет документов
          </h3>
          <p className="text-gray-600 mb-4">{emptyMessage}</p>
          <p className="text-sm text-gray-500">
            Документы будут добавлены администратором системы
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
