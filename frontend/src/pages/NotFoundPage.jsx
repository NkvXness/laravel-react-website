import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const { t } = useTranslation();

  // SEO мета-теги для 404 страницы
  useDocumentHead({
    title: `404 - ${t("common.notFound")}`,
    description: "Запрашиваемая страница не найдена",
  });

  return (
    <>
      {/* Контент 404 страницы */}
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Большая цифра 404 */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 select-none">
              404
            </h1>
          </div>

          {/* Заголовок */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t("common.notFound")}
          </h2>

          {/* Описание */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            К сожалению, запрашиваемая страница не существует или была
            перемещена. Возможно, вы перешли по устаревшей ссылке или допустили
            ошибку в адресе.
          </p>

          {/* Кнопки действий */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            {/* Кнопка "На главную" */}
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>{t("common.backToHome")}</span>
            </Link>

            {/* Кнопка "Назад" */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Назад</span>
            </button>
          </div>

          {/* Дополнительная помощь */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Нужна помощь?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Если вы считаете, что это ошибка, свяжитесь с нами:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">📞 Телефон: +375 (XX) XXX-XX-XX</p>
              <p className="text-gray-700">✉️ Email: info@medical-center.by</p>
              <p className="text-xs text-gray-500 mt-3">
                * Контактные данные будут настроены через CMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
