import { AlertTriangle } from "lucide-react";
import DocumentViewer from "../../../features/document-viewer/ui/DocumentViewer";
import {
  useIsAuthenticated,
  useCanAccessProfile,
} from "../../../entities/user/model/store";
import Alert from "../Alert/Alert";

/**
 * Переиспользуемый компонент страницы контента специалиста
 * Устраняет дублирование между LegislationPage и InformationPage
 */
const SpecialistContentPage = ({
  contentType,
  title,
  description,
  icon: Icon,
  alertConfig = null,
  additionalInfo = null,
  className = "",
}) => {
  const isAuthenticated = useIsAuthenticated();
  const canAccessProfile = useCanAccessProfile();

  // Проверяем доступ
  if (!isAuthenticated || !canAccessProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Доступ ограничен
          </h1>
          <p className="text-gray-600 mb-4">
            Эта страница доступна только авторизованным специалистам
            медицинского центра.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Войти в систему
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Хлебные крошки */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/profile"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Личный кабинет
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Предупреждение/информация */}
        {alertConfig && (
          <div className="mb-6">
            <Alert
              type={alertConfig.type}
              title={alertConfig.title}
              className={alertConfig.className}
            >
              <div className="flex">
                {Icon && (
                  <Icon
                    className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${alertConfig.iconClassName}`}
                  />
                )}
                <div>{alertConfig.content}</div>
              </div>
            </Alert>
          </div>
        )}

        {/* Основной контент */}
        <DocumentViewer
          contentType={contentType}
          title={title}
          description={description}
          emptyMessage={`${title} пока не загружены. Обратитесь к администратору для получения актуальных материалов.`}
        />

        {/* Дополнительная информация */}
        {additionalInfo && <div className="mt-8">{additionalInfo}</div>}
      </div>
    </div>
  );
};

export default SpecialistContentPage;
