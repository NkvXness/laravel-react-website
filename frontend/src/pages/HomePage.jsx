import { useTranslation } from "react-i18next";
import { useHomePage } from "../hooks/usePages";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { AlertCircle, Loader2 } from "lucide-react";

const HomePage = () => {
  const { t } = useTranslation();
  const { data: pageData, isLoading, error } = useHomePage();

  // SEO мета-теги (только если данные загружены)
  useDocumentHead({
    title: pageData?.meta_title || pageData?.title || "Главная страница",
    description: pageData?.meta_description || "",
    ogTitle: pageData?.meta_title || pageData?.title,
    ogDescription: pageData?.meta_description || "",
    ogType: "website",
    canonical: window.location.origin,
  });

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("common.error")}
          </h2>
          <p className="text-gray-600 mb-4">
            Не удалось загрузить содержимое главной страницы
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Если данные не загружены
  if (!pageData) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Главная страница не настроена
          </h2>
          <p className="text-gray-600">
            Пожалуйста, настройте содержимое главной страницы через админ-панель
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Контент страницы */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          {/* Заголовок страницы */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {pageData.title}
            </h1>
          </header>

          {/* Основной контент */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </article>

        {/* Дополнительная информация */}
        <aside className="mt-12 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Быстрые ссылки */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Экстренная помощь
              </h3>
              <p className="text-blue-700 mb-4">
                Круглосуточная консультация специалистов
              </p>
              <div className="space-y-2">
                <p className="text-blue-800 font-medium">
                  📞 +375 (XX) XXX-XX-XX
                </p>
                <p className="text-sm text-blue-600">
                  * Номер будет настроен через CMS
                </p>
              </div>
            </div>

            {/* Часы работы */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                Часы работы
              </h3>
              <div className="space-y-2 text-green-700">
                <p>Пн-Пт: 08:00 - 20:00</p>
                <p>Сб: 09:00 - 17:00</p>
                <p>Вс: 10:00 - 15:00</p>
                <p className="text-sm text-green-600 mt-3">
                  * Расписание будет настроено через CMS
                </p>
              </div>
            </div>

            {/* Запись на прием */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">
                Запись на прием
              </h3>
              <p className="text-purple-700 mb-4">
                Записаться на консультацию к специалисту
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                Записаться онлайн
              </button>
              <p className="text-xs text-purple-600 mt-2">
                * Функция будет добавлена на следующих этапах
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default HomePage;
