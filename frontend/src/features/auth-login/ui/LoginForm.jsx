import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { useTranslation } from "react-i18next";
import { Mail, Lock, LogIn } from "lucide-react";

import Button from "../../../shared/ui/Button/Button";
import Input from "../../../shared/ui/Input/Input";
import Alert from "../../../shared/ui/Alert/Alert";
import {
  useAuthActions,
  useAuthLoading,
  useAuthError,
} from "../../../entities/user/model/store";
import { userValidation } from "../../../entities/user/model/types";

/**
 * Форма входа в систему
 * Feature-слой для аутентификации
 */
const LoginForm = ({ onSuccess }) => {
  //const { t } = useTranslation();
  const navigate = useNavigate();

  // Состояние формы
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Данные из store
  const authActions = useAuthActions();
  const isLoading = useAuthLoading();
  const authError = useAuthError();

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
    if (authError) {
      authActions.clearError();
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    // Валидация email
    const emailError = userValidation.email(formData.email);
    if (emailError) errors.email = emailError;

    // Валидация пароля
    const passwordError = userValidation.password(formData.password);
    if (passwordError) errors.password = passwordError;

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
      const result = await authActions.login(formData);

      if (result.success) {
        // Успешный вход
        if (onSuccess) {
          onSuccess(result.user);
        } else {
          // Перенаправление в зависимости от роли
          if (result.user.can_access_admin) {
            navigate("/admin");
          } else if (result.user.can_access_profile) {
            navigate("/profile");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      // Ошибка обработается в store и отобразится через authError
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
        <p className="mt-2 text-sm text-gray-600">Войдите в свой аккаунт</p>
      </div>

      {/* Общая ошибка */}
      {authError && (
        <Alert
          type="error"
          message={authError}
          dismissible
          onClose={() => authActions.clearError()}
        />
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Пароль */}
        <Input
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleChange("password")}
          error={fieldErrors.password}
          required
          leftIcon={<Lock className="h-5 w-5" />}
          disabled={isLoading}
          autoComplete="current-password"
        />

        {/* Кнопка входа */}
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          isLoading={isLoading}
          leftIcon={!isLoading ? <LogIn className="h-5 w-5" /> : undefined}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </form>

      {/* Ссылки */}
      <div className="text-center space-y-2">
        <div className="text-sm">
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          >
            Зарегистрироваться как специалист
          </Link>
        </div>

        <div className="text-xs text-gray-500">
          Если вы специалист медицинского центра, зарегистрируйтесь по своему
          идентификационному номеру
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
