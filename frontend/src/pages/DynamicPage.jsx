import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePage } from "../hooks/usePages";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { AlertCircle, Loader2 } from "lucide-react";
import NotFoundPage from "./NotFoundPage";

const DynamicPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: pageData, isLoading, error } = usePage(slug);

  // SEO мета-теги (только если данные загружены)
  useDocumentHead({
    title: pageData?.meta_title || pageData?.title,
    description: pageData?.meta_description || "",
    ogTitle: pageData?.meta_title || pageData?.title,
    ogDescription: pageData?.meta_description || "",
    ogType: "article",
    canonical: `${window.location.origin}/${slug}`,
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

  // Состояние ошибки (404 или другая ошибка)
  if (error || !pageData) {
    return <NotFoundPage />;
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

        {/* Информация о последнем обновлении (если нужно) */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>
              Если у вас есть вопросы по содержимому этой страницы, свяжитесь с
              нами через{" "}
              <a
                href="/contacts"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                страницу контактов
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DynamicPage;
