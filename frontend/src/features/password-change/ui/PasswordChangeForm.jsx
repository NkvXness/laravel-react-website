import { useState } from "react";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";

import Button from "../../../shared/ui/Button/Button";
import Input from "../../../shared/ui/Input/Input";
import Alert from "../../../shared/ui/Alert/Alert";
import {
  useAuthActions,
  useProfileLoading,
  useProfileError,
} from "../../../entities/user/model/store";
import { userValidation } from "../../../entities/user/model/types";

/**
 * Форма смены пароля специалиста
 * Feature-слой для смены пароля
 */
const PasswordChangeForm = ({ onSuccess }) => {
  // Данные из store
  const authActions = useAuthActions();
  const isLoading = useProfileLoading();
  const error = useProfileError();

  // Состояние формы
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Обработка изменения полей
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Очистка ошибки поля при изменении
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }

    // Очистка общей ошибки и сообщения об успехе
    if (error) {
      authActions.clearError();
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  // Переключение видимости пароля
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    // Валидация текущего пароля
    if (!formData.current_password) {
      errors.current_password = "Текущий пароль обязателен";
    }

    // Валидация нового пароля
    const passwordError = userValidation.password(formData.new_password);
    if (passwordError) errors.new_password = passwordError;

    // Дополнительная проверка сложности пароля
    if (
      formData.new_password &&
      !/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(formData.new_password)
    ) {
      errors.new_password =
        "Пароль должен содержать минимум одну букву и одну цифру";
    }

    // Проверка совпадения паролей
    const confirmError = userValidation.passwordConfirmation(
      formData.new_password,
      formData.new_password_confirmation
    );
    if (confirmError) errors.new_password_confirmation = confirmError;

    // Проверка что новый пароль отличается от текущего
    if (formData.current_password && formData.new_password) {
      if (formData.current_password === formData.new_password) {
        errors.new_password = "Новый пароль должен отличаться от текущего";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Валидация
    if (!validateForm()) {
      return;
    }

    try {
      const result = await authActions.changePassword(formData);

      if (result.success) {
        // Очищаем форму
        setFormData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        setFieldErrors({});
        setSuccessMessage("Пароль успешно изменён");

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      // Ошибка обработается в store и отобразится через error
      console.error("Ошибка смены пароля:", error);
    }
  };

  // Сброс формы
  const handleReset = () => {
    setFormData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setFieldErrors({});
    setSuccessMessage("");
    authActions.clearError();
  };

  // Проверка силы пароля
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" };

    let score = 0;
    let feedback = [];

    // Длина
    if (password.length >= 8) score += 1;
    else feedback.push("минимум 8 символов");

    // Буквы
    if (/[a-zA-Z]/.test(password)) score += 1;
    else feedback.push("буквы");

    // Цифры
    if (/\d/.test(password)) score += 1;
    else feedback.push("цифры");

    // Спецсимволы
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    // Регистр
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;

    const strength = {
      0: { text: "Очень слабый", color: "text-red-600" },
      1: { text: "Слабый", color: "text-red-500" },
      2: { text: "Средний", color: "text-yellow-500" },
      3: { text: "Хороший", color: "text-blue-500" },
      4: { text: "Сильный", color: "text-green-500" },
      5: { text: "Очень сильный", color: "text-green-600" },
    };

    return {
      score,
      text: strength[score].text,
      color: strength[score].color,
      feedback:
        feedback.length > 0
          ? `Добавьте: ${feedback.join(", ")}`
          : "Отличный пароль!",
    };
  };

  const passwordStrength = getPasswordStrength(formData.new_password);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Смена пароля</h3>
        <p className="mt-1 text-sm text-gray-600">
          Регулярно меняйте пароль для обеспечения безопасности
        </p>
      </div>

      {/* Общая ошибка */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onClose={() => authActions.clearError()}
        />
      )}

      {/* Сообщение об успехе */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          dismissible
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Текущий пароль */}
        <Input
          type={showPasswords.current ? "text" : "password"}
          label="Текущий пароль"
          placeholder="Введите текущий пароль"
          value={formData.current_password}
          onChange={handleChange("current_password")}
          error={fieldErrors.current_password}
          required
          leftIcon={<Lock className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
          disabled={isLoading}
          autoComplete="current-password"
        />

        {/* Новый пароль */}
        <div className="space-y-2">
          <Input
            type={showPasswords.new ? "text" : "password"}
            label="Новый пароль"
            placeholder="Введите новый пароль"
            value={formData.new_password}
            onChange={handleChange("new_password")}
            error={fieldErrors.new_password}
            required
            leftIcon={<Shield className="h-5 w-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
            disabled={isLoading}
            autoComplete="new-password"
          />

          {/* Индикатор силы пароля */}
          {formData.new_password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={passwordStrength.color}>
                  Сила пароля: {passwordStrength.text}
                </span>
                <span className="text-gray-500">
                  {passwordStrength.score}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    passwordStrength.score <= 1
                      ? "bg-red-500"
                      : passwordStrength.score <= 2
                      ? "bg-yellow-500"
                      : passwordStrength.score <= 3
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                {passwordStrength.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Подтверждение нового пароля */}
        <Input
          type={showPasswords.confirm ? "text" : "password"}
          label="Подтверждение нового пароля"
          placeholder="Повторите новый пароль"
          value={formData.new_password_confirmation}
          onChange={handleChange("new_password_confirmation")}
          error={fieldErrors.new_password_confirmation}
          required
          leftIcon={<Shield className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
          disabled={isLoading}
          autoComplete="new-password"
        />

        {/* Кнопки */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={!isLoading ? <Shield className="h-5 w-5" /> : undefined}
          >
            {isLoading ? "Изменение..." : "Изменить пароль"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            Очистить
          </Button>
        </div>
      </form>

      {/* Рекомендации по безопасности */}
      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              Рекомендации по безопасности
            </h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Используйте уникальный пароль для каждого аккаунта</li>
                <li>Включите комбинацию букв, цифр и специальных символов</li>
                <li>Меняйте пароль каждые 3-6 месяцев</li>
                <li>Не используйте личную информацию в пароле</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
