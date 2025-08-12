import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "be", name: "Беларуская", flag: "🇧🇾" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode) => {
    try {
      // Сохраняем выбор в localStorage
      localStorage.setItem("language", languageCode);

      // Меняем язык
      await i18n.changeLanguage(languageCode);

      // Инвалидируем все запросы, чтобы перезагрузить данные на новом языке
      queryClient.invalidateQueries();

      setIsOpen(false);
    } catch (error) {
      console.error("Ошибка при смене языка:", error);
    }
  };

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Обработка клавиатуры для доступности
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={t("common.language")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span>{currentLanguage.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
          role="listbox"
          aria-label={t("common.language")}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                language.code === i18n.language
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => changeLanguage(language.code)}
              role="option"
              aria-selected={language.code === i18n.language}
            >
              <span className="text-lg" role="img" aria-label={language.name}>
                {language.flag}
              </span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
