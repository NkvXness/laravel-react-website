import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Переиспользуемый компонент поля ввода
 * Поддерживает различные типы, валидацию и доступность
 */
const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      required = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Генерируем уникальный ID если не передан
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Определяем реальный тип input'а
    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    // Определяем наличие ошибки
    const hasError = Boolean(error);

    // Базовые классы для инпута
    const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm
    placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
    transition-colors duration-200
    ${
      hasError
        ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
        : isFocused
        ? "border-blue-500 focus:ring-blue-500 focus:border-blue-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    }
    ${leftIcon ? "pl-10" : ""}
    ${rightIcon || type === "password" ? "pr-10" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {/* Лейбл */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && (
              <span
                className="text-red-500 ml-1"
                aria-label="обязательное поле"
              >
                *
              </span>
            )}
          </label>
        )}

        {/* Контейнер для инпута с иконками */}
        <div className="relative">
          {/* Левая иконка */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span
                className={`h-5 w-5 ${
                  hasError ? "text-red-400" : "text-gray-400"
                }`}
              >
                {leftIcon}
              </span>
            </div>
          )}

          {/* Основное поле ввода */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={hasError}
            aria-describedby={`
            ${error ? errorId : ""} 
            ${helperText ? helperId : ""}
          `.trim()}
            {...props}
          />

          {/* Правая иконка или кнопка показать/скрыть пароль */}
          {(rightIcon || type === "password") && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {type === "password" ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  aria-label={
                    isPasswordVisible ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : rightIcon ? (
                <span
                  className={`h-5 w-5 ${
                    hasError ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {rightIcon}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div
            id={errorId}
            className="mt-1 flex items-center text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Вспомогательный текст */}
        {helperText && !error && (
          <div id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
