import { useState, useEffect } from "react";
import {
  User,
  Activity,
  FileText,
  Download,
  Calendar,
  Mail,
  Shield,
  Settings,
  TrendingUp,
  Clock,
  Building2, // ДОБАВЛЕНО
} from "lucide-react";

import Button from "../../shared/ui/Button/Button";
import Alert from "../../shared/ui/Alert/Alert";
import {
  useAuthActions,
  useProfile,
  useActivity,
  useActivityLoading,
  //useProfileLoading,
} from "../../entities/user/model/store";

/**
 * Виджет панели управления профилем специалиста
 * Показывает статистику, активность и быстрые действия
 */
const ProfileDashboard = ({ onEditProfile, onChangePassword }) => {
  const authActions = useAuthActions();
  const profile = useProfile();
  const activity = useActivity();
  const isActivityLoading = useActivityLoading();
  //const isProfileLoading = useProfileLoading();

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
    if (!dateString) return "Никогда";
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Получаем статистику из профиля
  const statistics = profile?.statistics || {
    content_pages: 0,
    total_files: 0,
    profile_completion: 0,
  };

  return (
    <div className="space-y-6">
      {/* ОБНОВЛЕНО: Приветствие с информацией о ЦРБ */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {greeting}, {profile?.first_name}!
            </h2>
            <p className="mt-1 text-blue-100">
              Добро пожаловать в ваш личный кабинет
            </p>
            {/* ДОБАВЛЕНО: Отображение ЦРБ */}
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

        {/* Прогресс заполнения профиля */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
            <span>Заполнение профиля</span>
            <span>{statistics.profile_completion}%</span>
          </div>
          <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${statistics.profile_completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onEditProfile}
          leftIcon={<User className="h-5 w-5" />}
          className="justify-start p-4 h-auto"
        >
          <div className="text-left">
            <div className="font-medium">Редактировать профиль</div>
            <div className="text-sm text-gray-500">Изменить личные данные</div>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={onChangePassword}
          leftIcon={<Shield className="h-5 w-5" />}
          className="justify-start p-4 h-auto"
        >
          <div className="text-left">
            <div className="font-medium">Сменить пароль</div>
            <div className="text-sm text-gray-500">Обновить пароль доступа</div>
          </div>
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Страниц контента
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
              <Download className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего файлов</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.total_files}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Заполнение</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statistics.profile_completion}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ОБНОВЛЕНО: Информация о профиле с ЦРБ */}
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

            {/* ДОБАВЛЕНО: Название ЦРБ */}
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

      {/* Последняя активность */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Последняя активность
          </h3>
        </div>
        <div className="p-6">
          {isActivityLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">
                Загрузка активности...
              </p>
            </div>
          ) : activity?.content_updates?.length > 0 ? (
            <div className="space-y-3">
              {activity.content_updates.map((update, index) => (
                <div key={index} className="flex items-center py-2">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">
                      Обновлён контент:{" "}
                      <span className="font-medium">{update.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(update.updated_at)} • {update.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Пока нет активности</p>
              <p className="text-xs text-gray-400 mt-1">
                Начните создавать контент, чтобы увидеть активность здесь
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
