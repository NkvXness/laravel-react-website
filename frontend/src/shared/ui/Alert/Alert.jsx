import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Переиспользуемый компонент уведомления
 * Поддерживает различные типы и автоматическое закрытие
 */
const Alert = ({
  type = "info",
  title,
  message,
  onClose,
  dismissible = false,
  className = "",
  icon: customIcon,
  children,
}) => {
  // Конфигурация для разных типов уведомлений
  const alertConfig = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-400",
      icon: CheckCircle,
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-400",
      icon: AlertCircle,
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-400",
      icon: AlertTriangle,
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-400",
      icon: Info,
    },
  };

  const config = alertConfig[type];
  const IconComponent = customIcon || config.icon;

  return (
    <div
      className={`
        rounded-md border p-4 ${config.bgColor} ${config.borderColor}
        ${className}
      `}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div className="flex">
        {/* Иконка */}
        <div className="flex-shrink-0">
          <IconComponent
            className={`h-5 w-5 ${config.iconColor}`}
            aria-hidden="true"
          />
        </div>

        {/* Контент */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor} mb-1`}>
              {title}
            </h3>
          )}

          {message && (
            <div className={`text-sm ${config.textColor}`}>{message}</div>
          )}

          {children && (
            <div className={`text-sm ${config.textColor}`}>{children}</div>
          )}
        </div>

        {/* Кнопка закрытия */}
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${config.textColor} hover:${config.bgColor} focus:ring-offset-${config.bgColor} 
                  focus:ring-indigo-600
                `}
                aria-label="Закрыть уведомление"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
