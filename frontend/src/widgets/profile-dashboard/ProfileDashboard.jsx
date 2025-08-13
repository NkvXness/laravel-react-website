import { useState, useEffect } from "react";
import { User, Mail, Calendar, Clock, Building2, FileText } from "lucide-react";

import {
  useAuthActions,
  useProfile,
  // useActivity,
  // useActivityLoading,
} from "../../entities/user/model/store";

const ProfileDashboard = () => {
  const authActions = useAuthActions();
  const profile = useProfile();
  // const activity = useActivity();
  // const isActivityLoading = useActivityLoading();

  const [greeting, setGreeting] = useState("");

  // Генерируем приветствие в зависимости от времени
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "";

    if (hour < 6) greetingText = "Доброй ночи";
    else if (hour < 12) greetingText = "Доброе утро";
    else if (hour < 18) greetingText = "Добрый день";
    else greetingText = "Добрый вечер";

    setGreeting(greetingText);
  }, []);

  // Загружаем активность при монтировании
  useEffect(() => {
    authActions.fetchActivity().catch(console.error);
  }, [authActions]);

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "Не определено";

    try {
      const date = new Date(dateString);
      // Проверяем валидность даты
      if (isNaN(date.getTime())) return "Не определено";

      return date.toLocaleString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "Не определено";
    }
  };

  // Получаем УПРОЩЕННУЮ статистику
  const statistics = profile?.statistics || {
    content_pages: 0,
    total_files: 0,
  };

  return (
    <div className="space-y-6">
      {/* ОБНОВЛЕННОЕ приветствие с информацией о ЦРБ */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {greeting}, {profile?.first_name}!
            </h2>
            <p className="mt-1 text-blue-100">
              Добро пожаловать в ваш личный кабинет
            </p>
            {/* Отображение ЦРБ */}
            {profile?.hospital_name && (
              <p className="mt-2 text-sm text-blue-200 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                {profile.hospital_name}
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* УПРОЩЕННАЯ статистика - только основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Разделов контента
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.content_pages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Доступных файлов
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.total_files}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ОБНОВЛЕННАЯ информация о профиле */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Информация о профиле
          </h3>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Полное имя
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile?.full_name || "Не указано"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile?.email || "Не указано"}
              </dd>
            </div>

            {/* Название ЦРБ */}
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Место работы (ЦРБ)
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile?.hospital_name || "Не указано"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Дата регистрации
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(profile?.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Последний вход
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(profile?.last_login_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
