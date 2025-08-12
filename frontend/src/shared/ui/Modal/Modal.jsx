import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

/**
 * Переиспользуемый компонент модального окна
 * Поддерживает доступность, управление фокусом и клавиатурную навигацию
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Размеры модального окна
  const sizes = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  // Эффект для управления фокусом и клавиатурой
  useEffect(() => {
    if (!isOpen) return;

    // Сохраняем текущий активный элемент
    previousActiveElement.current = document.activeElement;

    // Устанавливаем фокус на модальное окно
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Блокируем прокрутку body
    document.body.style.overflow = "hidden";

    // Обработчик клавиши Escape
    const handleEscape = (event) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    // Обработчик для trap focus внутри модального окна
    const handleTabKey = (event) => {
      if (event.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabKey);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabKey);
      document.body.style.overflow = "unset";

      // Возвращаем фокус на предыдущий элемент
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Обработчик клика по overlay
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Если модальное окно закрыто, ничего не рендерим
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay (фон) */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Модальное окно */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl w-full ${sizes[size]}
          transform transition-all animate-fade-in
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
      >
        {/* Заголовок */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                aria-label="Закрыть модальное окно"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Контент */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  // Рендерим через портал в body
  return createPortal(modalContent, document.body);
};

export default Modal;
