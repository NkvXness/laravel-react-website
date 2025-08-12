import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

/**
 * Переиспользуемый компонент кнопки
 * Следует принципам доступности WCAG 2.1 AA
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

    const variants = {
      primary: `
      bg-blue-600 text-white hover:bg-blue-700 
      focus:ring-blue-500 active:bg-blue-800
    `,
      secondary: `
      bg-gray-200 text-gray-900 hover:bg-gray-300 
      focus:ring-gray-500 active:bg-gray-400
    `,
      danger: `
      bg-red-600 text-white hover:bg-red-700 
      focus:ring-red-500 active:bg-red-800
    `,
      outline: `
      border border-gray-300 bg-white text-gray-700 
      hover:bg-gray-50 focus:ring-blue-500 active:bg-gray-100
    `,
      ghost: `
      bg-transparent text-blue-600 hover:bg-blue-50 
      focus:ring-blue-500 active:bg-blue-100
    `,
    };

    const sizes = {
      small: "px-3 py-2 text-sm min-h-[36px]",
      medium: "px-4 py-2 text-sm min-h-[40px]",
      large: "px-6 py-3 text-base min-h-[44px]",
    };

    const finalClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={finalClasses}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Левая иконка */}
        {leftIcon && !isLoading && (
          <span className="mr-2 -ml-1">{leftIcon}</span>
        )}

        {/* Спиннер загрузки */}
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {/* Контент кнопки */}
        <span>{children}</span>

        {/* Правая иконка */}
        {rightIcon && !isLoading && (
          <span className="ml-2 -mr-1">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
