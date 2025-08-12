import { useState, useEffect } from "react";
import { User, Settings, Shield, Activity, Home, Bell } from "lucide-react";

import Button from "../shared/ui/Button/Button";
import Alert from "../shared/ui/Alert/Alert";
import Modal from "../shared/ui/Modal/Modal";
import {
  useAuthActions,
  useProfile,
  useProfileLoading,
  useIsSpecialist,
  useUser,
} from "../entities/user/model/store";
import { useDocumentHead } from "../hooks/useDocumentHead";

// Компоненты для личного кабинета
import ProfileDashboard from "../widgets/profile-dashboard/ProfileDashboard";
import ProfileEditForm from "../features/profile-edit/ui/ProfileEditForm";
import PasswordChangeForm from "../features/password-change/ui/PasswordChangeForm";

/**
 * Страница личного кабинета специалиста
 * Интегрирует все функции управления профилем
 */
const ProfilePage = () => {
  const authActions = useAuthActions();
  const profile = useProfile();
  const isLoading = useProfileLoading();
  const isSpecialist = useIsSpecialist();
  const user = useUser();

  // Состояние интерфейса
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // SEO
  useDocumentHead({
    title: `Личный кабинет - ${user?.full_name || "Специалист"}`,
    description:
      "Управление профилем и персональными данными специалиста медицинского центра UGOND",
  });

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

  // Конфигурация табов
  const tabs = [
    {
      id: "dashboard",
      label: "Обзор",
      icon: Home,
      component: (
        <ProfileDashboard
          onEditProfile={() => setIsEditModalOpen(true)}
          onChangePassword={() => setIsPasswordModalOpen(true)}
        />
      ),
    },
    {
      id: "activity",
      label: "Активность",
      icon: Activity,
      component: (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Подробная активность</h3>
          <p className="text-gray-600">
            Детальная информация об активности будет добавлена в следующих
            версиях.
          </p>
        </div>
      ),
    },
    {
      id: "settings",
      label: "Настройки",
      icon: Settings,
      component: (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Настройки аккаунта</h3>
          <p className="text-gray-600">
            Дополнительные настройки будут доступны в следующих версиях.
          </p>
        </div>
      ),
    },
  ];

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
            {/* Заголовок и навигация */}
            <div className="bg-white rounded-lg border mb-6">
              <div className="px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Личный кабинет
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Управляйте своим профилем и настройками
                </p>
              </div>

              {/* Табы */}
              <div className="border-t border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Контент таба */}
            <div className="pb-8">
              {tabs.find((tab) => tab.id === activeTab)?.component}
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
