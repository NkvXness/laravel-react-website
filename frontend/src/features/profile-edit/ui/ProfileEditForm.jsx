import { useState, useEffect } from "react";
import { Save, User, Mail } from "lucide-react";

import Button from "../../../shared/ui/Button/Button";
import Input from "../../../shared/ui/Input/Input";
import Alert from "../../../shared/ui/Alert/Alert";
import {
  useAuthActions,
  useProfile,
  useProfileLoading,
  useProfileError,
} from "../../../entities/user/model/store";
import { userValidation } from "../../../entities/user/model/types";

/**
 * Форма редактирования профиля специалиста
 * Feature-слой для редактирования профиля
 */
const ProfileEditForm = ({ onSuccess }) => {
  // Данные из store
  const authActions = useAuthActions();
  const profile = useProfile();
  const isLoading = useProfileLoading();
  const error = useProfileError();

  // Состояние формы
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Заполняем форму данными профиля
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  // Отслеживаем изменения
  useEffect(() => {
    if (profile) {
      const hasChanges =
        formData.first_name !== profile.first_name ||
        formData.last_name !== profile.last_name ||
        formData.email !== profile.email;

      setIsDirty(hasChanges);
    }
  }, [formData, profile]);

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

    // Очистка общей ошибки
    if (error) {
      authActions.clearError();
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    // Валидация имени
    const firstNameError = userValidation.firstName(formData.first_name);
    if (firstNameError) errors.first_name = firstNameError;

    // Валидация фамилии
    const lastNameError = userValidation.lastName(formData.last_name);
    if (lastNameError) errors.last_name = lastNameError;

    // Валидация email
    const emailError = userValidation.email(formData.email);
    if (emailError) errors.email = emailError;

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
      const result = await authActions.updateProfile(formData);

      if (result.success) {
        setIsDirty(false);
        if (onSuccess) {
          onSuccess(result.profile);
        }
      }
    } catch (error) {
      // Ошибка обработается в store и отобразится через error
      console.error("Ошибка обновления профиля:", error);
    }
  };

  // Сброс изменений
  const handleReset = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
      });
      setFieldErrors({});
      setIsDirty(false);
      authActions.clearError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Основная информация
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Обновите свои персональные данные
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

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Имя */}
          <Input
            type="text"
            label="Имя"
            placeholder="Введите ваше имя"
            value={formData.first_name}
            onChange={handleChange("first_name")}
            error={fieldErrors.first_name}
            required
            leftIcon={<User className="h-5 w-5" />}
            disabled={isLoading}
            autoComplete="given-name"
          />

          {/* Фамилия */}
          <Input
            type="text"
            label="Фамилия"
            placeholder="Введите вашу фамилию"
            value={formData.last_name}
            onChange={handleChange("last_name")}
            error={fieldErrors.last_name}
            required
            leftIcon={<User className="h-5 w-5" />}
            disabled={isLoading}
            autoComplete="family-name"
          />
        </div>

        {/* Email */}
        <Input
          type="email"
          label="Email"
          placeholder="Введите ваш email"
          value={formData.email}
          onChange={handleChange("email")}
          error={fieldErrors.email}
          required
          leftIcon={<Mail className="h-5 w-5" />}
          disabled={isLoading}
          autoComplete="email"
        />

        {/* Кнопки */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!isDirty}
            leftIcon={!isLoading ? <Save className="h-5 w-5" /> : undefined}
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
          >
            Отменить
          </Button>
        </div>
      </form>

      {/* Индикатор изменений */}
      {isDirty && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                У вас есть несохранённые изменения
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
