import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  User,
  IdCard,
  UserPlus,
  CheckCircle,
  Building2,
} from "lucide-react";

import Button from "../../../shared/ui/Button/Button";
import Input from "../../../shared/ui/Input/Input";
import Alert from "../../../shared/ui/Alert/Alert";
import {
  useAuthActions,
  useAuthLoading,
  useAuthError,
} from "../../../entities/user/model/store";
import {
  userValidation,
  HOSPITAL_NAME_EXAMPLES,
} from "../../../entities/user/model/types";

/**
 * Форма регистрации специалиста
 * Двухэтапная регистрация: проверка ID номера -> заполнение данных
 */
const RegisterSpecialistForm = ({ onSuccess }) => {
  //const { t } = useTranslation();
  const navigate = useNavigate();

  // Состояние формы
  const [step, setStep] = useState(1); // 1 - проверка ID, 2 - регистрация
  const [formData, setFormData] = useState({
    identification_number: "",
    first_name: "",
    last_name: "",
    hospital_name: "", // ДОБАВЛЕНО
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [showHospitalExamples, setShowHospitalExamples] = useState(false); // ДОБАВЛЕНО

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

  // ДОБАВЛЕНО: Выбор примера названия ЦРБ
  const handleHospitalExampleSelect = (hospitalName) => {
    setFormData((prev) => ({
      ...prev,
      hospital_name: hospitalName,
    }));
    setShowHospitalExamples(false);

    // Очистка ошибки поля
    if (fieldErrors.hospital_name) {
      setFieldErrors((prev) => ({
        ...prev,
        hospital_name: null,
      }));
    }
  };

  // Валидация первого шага (ID номер)
  const validateStep1 = () => {
    const errors = {};
    const idError = userValidation.identificationNumber(
      formData.identification_number
    );
    if (idError) errors.identification_number = idError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ОБНОВЛЕНО: Валидация второго шага (данные регистрации с ЦРБ)
  const validateStep2 = () => {
    const errors = {};

    // Валидация имени
    const firstNameError = userValidation.firstName(formData.first_name);
    if (firstNameError) errors.first_name = firstNameError;

    // Валидация фамилии
    const lastNameError = userValidation.lastName(formData.last_name);
    if (lastNameError) errors.last_name = lastNameError;

    // ДОБАВЛЕНО: Валидация названия ЦРБ
    const hospitalNameError = userValidation.hospitalName(
      formData.hospital_name
    );
    if (hospitalNameError) errors.hospital_name = hospitalNameError;

    // Валидация email
    const emailError = userValidation.email(formData.email);
    if (emailError) errors.email = emailError;

    // Валидация пароля
    const passwordError = userValidation.password(formData.password);
    if (passwordError) errors.password = passwordError;

    // Валидация подтверждения пароля
    const confirmError = userValidation.passwordConfirmation(
      formData.password,
      formData.password_confirmation
    );
    if (confirmError) errors.password_confirmation = confirmError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Проверка ID номера (шаг 1)
  const handleCheckId = async (event) => {
    event.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setIsCheckingId(true);

    try {
      await authActions.checkIdentificationNumber(
        formData.identification_number
      );

      // Если ID номер валиден, переходим ко второму шагу
      setStep(2);
      setFieldErrors({});
    } catch (error) {
      setFieldErrors({
        identification_number: error.message,
      });
    } finally {
      setIsCheckingId(false);
    }
  };

  // Финальная регистрация (шаг 2)
  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateStep2()) {
      return;
    }

    try {
      const result = await authActions.registerSpecialist(formData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.user);
        } else {
          // Перенаправляем на страницу входа с сообщением об успехе
          navigate("/login", {
            state: {
              message:
                "Регистрация успешно завершена! Теперь вы можете войти в систему.",
            },
          });
        }
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  // Возврат к первому шагу
  const handleBackToStep1 = () => {
    setStep(1);
    setFieldErrors({});
    setShowHospitalExamples(false); // ДОБАВЛЕНО
    if (authError) {
      authActions.clearError();
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Регистрация специалиста
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 1
            ? "Введите ваш идентификационный номер"
            : "Заполните данные для регистрации"}
        </p>
      </div>

      {/* Индикатор шагов */}
      <div className="flex items-center justify-center space-x-4">
        <div
          className={`flex items-center space-x-2 ${
            step >= 1 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${
              step >= 1
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300"
            }`}
          >
            {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-sm font-medium">ID номер</span>
        </div>

        <div
          className={`w-8 h-0.5 ${step > 1 ? "bg-blue-600" : "bg-gray-300"}`}
        />

        <div
          className={`flex items-center space-x-2 ${
            step >= 2 ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${step >= 2 ? "border-blue-600" : "border-gray-300"}`}
          >
            2
          </div>
          <span className="text-sm font-medium">Данные</span>
        </div>
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

      {/* Шаг 1: Проверка ID номера */}
      {step === 1 && (
        <form onSubmit={handleCheckId} className="space-y-4">
          <Input
            type="text"
            label="Идентификационный номер"
            placeholder="Введите ваш ID номер"
            value={formData.identification_number}
            onChange={handleChange("identification_number")}
            error={fieldErrors.identification_number}
            required
            leftIcon={<IdCard className="h-5 w-5" />}
            disabled={isCheckingId}
            helperText="Номер, выданный администрацией медицинского центра"
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            isLoading={isCheckingId}
          >
            {isCheckingId ? "Проверка..." : "Проверить номер"}
          </Button>
        </form>
      )}

      {/* Шаг 2: Данные регистрации */}
      {step === 2 && (
        <form onSubmit={handleRegister} className="space-y-4">
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
          />

          {/* ДОБАВЛЕНО: Название ЦРБ */}
          <div className="space-y-2">
            <Input
              type="text"
              label="Название ЦРБ"
              placeholder='Например: ГУЗ "Центральная районная больница"'
              value={formData.hospital_name}
              onChange={handleChange("hospital_name")}
              error={fieldErrors.hospital_name}
              required
              leftIcon={<Building2 className="h-5 w-5" />}
              disabled={isLoading}
              helperText="Полное официальное название вашего медицинского учреждения"
            />

            {/* Кнопка показа примеров */}
            <button
              type="button"
              onClick={() => setShowHospitalExamples(!showHospitalExamples)}
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              disabled={isLoading}
            >
              {showHospitalExamples
                ? "Скрыть примеры"
                : "Показать примеры названий"}
            </button>

            {/* Примеры названий ЦРБ */}
            {showHospitalExamples && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-2">
                  Нажмите на пример, чтобы выбрать:
                </p>
                {HOSPITAL_NAME_EXAMPLES.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleHospitalExampleSelect(example)}
                    className="block w-full text-left text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    disabled={isLoading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
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

          {/* Пароль */}
          <Input
            type="password"
            label="Пароль"
            placeholder="Придумайте пароль"
            value={formData.password}
            onChange={handleChange("password")}
            error={fieldErrors.password}
            required
            leftIcon={<Lock className="h-5 w-5" />}
            disabled={isLoading}
            helperText="Минимум 8 символов, должен содержать буквы и цифры"
            autoComplete="new-password"
          />

          {/* Подтверждение пароля */}
          <Input
            type="password"
            label="Подтверждение пароля"
            placeholder="Повторите пароль"
            value={formData.password_confirmation}
            onChange={handleChange("password_confirmation")}
            error={fieldErrors.password_confirmation}
            required
            leftIcon={<Lock className="h-5 w-5" />}
            disabled={isLoading}
            autoComplete="new-password"
          />

          {/* Кнопки */}
          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              isLoading={isLoading}
              leftIcon={
                !isLoading ? <UserPlus className="h-5 w-5" /> : undefined
              }
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="medium"
              fullWidth
              onClick={handleBackToStep1}
              disabled={isLoading}
            >
              Изменить ID номер
            </Button>
          </div>
        </form>
      )}

      {/* Ссылки */}
      <div className="text-center">
        <div className="text-sm">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          >
            Войти в систему
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSpecialistForm;
