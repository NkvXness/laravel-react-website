import { useEffect } from "react";

/**
 * Хук для управления метатегами документа в React 19
 * Замена react-helmet-async для совместимости с React 19
 */
export const useDocumentHead = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
  canonical,
}) => {
  useEffect(() => {
    // Сохраняем оригинальные значения для восстановления
    const originalTitle = document.title;
    const originalDescription =
      document.querySelector('meta[name="description"]')?.content || "";

    // Функция для обновления или создания метатега
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;

      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Функция для обновления или создания link тега
    const updateLinkTag = (rel, href) => {
      if (!href) return;

      let link = document.querySelector(`link[rel="${rel}"]`);

      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    // Обновляем title
    if (title) {
      document.title = title;
    }

    // Обновляем метатеги
    updateMetaTag("description", description);
    updateMetaTag("og:title", ogTitle || title, true);
    updateMetaTag("og:description", ogDescription || description, true);
    updateMetaTag("og:type", ogType, true);

    // Обновляем canonical URL
    updateLinkTag("canonical", canonical);

    // Cleanup функция для восстановления оригинальных значений
    return () => {
      document.title = originalTitle;

      if (originalDescription) {
        updateMetaTag("description", originalDescription);
      }
    };
  }, [title, description, ogTitle, ogDescription, ogType, canonical]);
};

/**
 * Компонент для управления head (аналог Helmet)
 */
export const DocumentHead = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType,
  canonical,
  children,
}) => {
  useDocumentHead({
    title,
    description,
    ogTitle,
    ogDescription,
    ogType,
    canonical,
  });

  return children || null;
};

export default useDocumentHead;
