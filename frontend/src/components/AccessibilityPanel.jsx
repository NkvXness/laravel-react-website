import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { X, Plus, Minus, Eye, EyeOff, Sun, Moon } from "lucide-react";

const AccessibilityPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  // Состояния настроек доступности
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("accessibility-font-size") || "16");
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("accessibility-high-contrast") === "true";
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("accessibility-dark-mode") === "true";
  });

  // Применение настроек к документу
  useEffect(() => {
    const root = document.documentElement;

    // Размер шрифта
    root.style.fontSize = `${fontSize}px`;
    localStorage.setItem("accessibility-font-size", fontSize.toString());

    // Высокий контраст
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem(
      "accessibility-high-contrast",
      highContrast.toString()
    );

    // Темная тема
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("accessibility-dark-mode", darkMode.toString());
  }, [fontSize, highContrast, darkMode]);

  // Загрузка настроек при монтировании
  useEffect(() => {
    const savedFontSize = localStorage.getItem("accessibility-font-size");
    const savedHighContrast =
      localStorage.getItem("accessibility-high-contrast") === "true";
    const savedDarkMode =
      localStorage.getItem("accessibility-dark-mode") === "true";

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    setHighContrast(savedHighContrast);
    setDarkMode(savedDarkMode);
  }, []);

  // Функции управления размером шрифта
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  const resetSettings = () => {
    setFontSize(16);
    setHighContrast(false);
    setDarkMode(false);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-900">
              {t("common.accessibility")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Закрыть панель доступности"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Размер шрифта */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Размер шрифта
              </h3>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Уменьшить шрифт"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">{fontSize}px</span>
                <button
                  type="button"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                  className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Увеличить шрифт"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Высокий контраст */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Высокий контраст
              </h3>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`flex items-center space-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  highContrast
                    ? "text-blue-700 bg-blue-100"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                aria-label="Переключить высокий контраст"
                aria-pressed={highContrast}
              >
                {highContrast ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                <span className="text-sm">{highContrast ? "Вкл" : "Выкл"}</span>
              </button>
            </div>

            {/* Темная тема */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Темная тема
              </h3>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center space-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "text-blue-700 bg-blue-100"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                aria-label="Переключить темную тему"
                aria-pressed={darkMode}
              >
                {darkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="text-sm">{darkMode ? "Вкл" : "Выкл"}</span>
              </button>
            </div>

            {/* Сброс настроек */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Сброс</h3>
              <button
                type="button"
                onClick={resetSettings}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Сбросить все
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
