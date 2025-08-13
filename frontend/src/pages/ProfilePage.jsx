import { useState, useEffect } from "react";
import { User, Settings } from "lucide-react";

import Button from "../shared/ui/Button/Button";
import Alert from "../shared/ui/Alert/Alert";
import Modal from "../shared/ui/Modal/Modal";
import QuickDocumentLinks from "../shared/ui/QuickDocumentLinks/QuickDocumentLinks";
import {
  useAuthActions,
  useProfile,
  useProfileLoading,
  useIsSpecialist,
  useUser,
} from "../entities/user/model/store";

// Компоненты для личного кабинета
import ProfileDashboard from "../widgets/profile-dashboard/ProfileDashboard";
import ProfileEditForm from "../features/profile-edit/ui/ProfileEditForm";
import PasswordChangeForm from "../features/password-change/ui/PasswordChangeForm";

/**
 * УПРОЩЕННАЯ страница личного кабинета специалиста
 * Убраны табы, добавлены прямые ссылки на документы
 */
const ProfilePage = () => {
  const authActions = useAuthActions();
  const profile = useProfile();
  const isLoading = useProfileLoading();
  const isSpecialist = useIsSpecialist();
  const user = useUser();

  // Состояние модальных окон
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Устанавливаем заголовок страницы (React 19 way)
  useEffect(() => {
    document.title = `Личный кабинет - ${
      user?.full_name || "Специалист"
    } - Медицинский центр`;
  }, [user?.full_name]);

  // Загружаем профиль при монтировании
  useEffect(() => {
    if (isSpecialist && !profile) {
      authActions.fetchProfile().catch(console.error);
    }
  }, [isSpecialist, profile, authActions]);

  // Обработчики успешных операций
  const handleProfileUpdateSuccess = () => {
    setSuccessMessage("Профиль успешно обновлён");
    setIsEditModalOpen(false);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handlePasswordChangeSuccess = () => {
    setSuccessMessage("Пароль успешно изменён");
    setIsPasswordModalOpen(false);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Хлебные крошки */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <a href="/" className="text-gray-400 hover:text-gray-500">
                  Главная
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  Личный кабинет
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Сообщение об успехе */}
        {successMessage && (
          <div className="mb-6">
            <Alert
              type="success"
              message={successMessage}
              dismissible
              onClose={() => setSuccessMessage("")}
            />
          </div>
        )}

        {/* Загрузка */}
        {isLoading && !profile ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Загрузка профиля...</p>
          </div>
        ) : (
          <>
            {/* УПРОЩЕННЫЙ заголовок без табов */}
            <div className="bg-white rounded-lg border mb-6 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Личный кабинет
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Управляйте своим профилем и получайте доступ к документам
                  </p>
                </div>

                {/* Быстрые действия */}
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    leftIcon={<User className="h-4 w-4" />}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    leftIcon={<Settings className="h-4 w-4" />}
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Сменить пароль
                  </Button>
                </div>
              </div>
            </div>

            {/* Основная панель управления */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ProfileDashboard
                  onEditProfile={() => setIsEditModalOpen(true)}
                  onChangePassword={() => setIsPasswordModalOpen(true)}
                />
              </div>

              {/* Быстрые ссылки на документы */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border p-6">
                  <QuickDocumentLinks />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Модальное окно редактирования профиля */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактирование профиля"
        size="large"
      >
        <ProfileEditForm onSuccess={handleProfileUpdateSuccess} />
      </Modal>

      {/* Модальное окно смены пароля */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Смена пароля"
        size="medium"
      >
        <PasswordChangeForm onSuccess={handlePasswordChangeSuccess} />
      </Modal>
    </div>
  );
};

export default ProfilePage;
