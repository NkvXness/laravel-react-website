import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Globe,
  Eye,
  Database,
  Server,
} from "lucide-react";
import { useApiHealth } from "../../hooks/usePages";

const AdminDashboard = () => {
  const { data: healthData, isLoading: isHealthLoading } = useApiHealth();

  // Статус этапов разработки
  const developmentSteps = [
    {
      step: 1,
      title: "MVP (Минимальная версия)",
      status: "completed",
      features: [
        "Главная страница",
        "Базовое API",
        "Переключение языков",
        "Хлебные крошки",
        "Версия для слабовидящих",
      ],
    },
    {
      step: 2,
      title: "CMS основы",
      status: "pending",
      features: [
        "CRUD страниц",
        "Админ-панель для страниц",
        "Динамическая навигация",
      ],
    },
    {
      step: 3,
      title: "Полная многоязычность",
      status: "pending",
      features: [
        "Многоязычный контент в CMS",
        "SEO-URL для языков",
        "Переводы интерфейса",
      ],
    },
    {
      step: 4,
      title: "Доступность WCAG 2.1 AA",
      status: "pending",
      features: [
        "Навигация с клавиатуры",
        "Screen reader поддержка",
        "Контрастные цвета",
      ],
    },
    {
      step: 5,
      title: "Продвинутая CMS",
      status: "pending",
      features: [
        "Конструктор страниц",
        "Управление медиафайлами",
        "Система ролей",
      ],
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Завершен";
      case "in-progress":
        return "В работе";
      default:
        return "Ожидает";
    }
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-1">
          Добро пожаловать в админ-панель медицинского сайта
        </p>
      </div>

      {/* Статус системы */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API статус */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                API Статус
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Состояние backend сервера
              </p>
            </div>
            <Server className="h-8 w-8 text-blue-500" />
          </div>

          <div className="mt-4">
            {isHealthLoading ? (
              <div className="flex items-center space-x-2 text-yellow-600">
                <Clock className="h-4 w-4 animate-spin" />
                <span className="text-sm">Проверка...</span>
              </div>
            ) : healthData ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Работает</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Недоступен</span>
              </div>
            )}
          </div>
        </div>

        {/* База данных */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                База данных
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                MySQL через phpMyAdmin
              </p>
            </div>
            <Database className="h-8 w-8 text-green-500" />
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Подключена</span>
            </div>
            <a
              href="http://localhost/phpmyadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
            >
              Открыть phpMyAdmin →
            </a>
          </div>
        </div>

        {/* Многоязычность */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Языки</h3>
              <p className="text-sm text-gray-600 mt-1">Поддерживаемые языки</p>
            </div>
            <Globe className="h-8 w-8 text-purple-500" />
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇷🇺</span>
              <span className="text-sm text-gray-700">Русский</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇧🇾</span>
              <span className="text-sm text-gray-700">Беларуская</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇺🇸</span>
              <span className="text-sm text-gray-700">English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Этапы разработки */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Этапы разработки
          </h2>
          <p className="text-gray-600 mt-1">
            Прогресс реализации функциональности
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {developmentSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Шаг {step.step}: {step.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        step.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : step.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getStatusText(step.status)}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-1">
                    {step.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center space-x-2"
                      >
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Быстрые действия
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Просмотр сайта */}
            <Link
              to="/"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Eye className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">Просмотр сайта</h3>
                <p className="text-sm text-gray-600">Открыть публичную часть</p>
              </div>
            </Link>

            {/* Управление страницами (недоступно) */}
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-500">
                  Управление страницами
                </h3>
                <p className="text-sm text-gray-500">Будет доступно в Шаге 2</p>
              </div>
            </div>

            {/* phpMyAdmin */}
            <a
              href="http://localhost/phpmyadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Database className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">База данных</h3>
                <p className="text-sm text-gray-600">Открыть phpMyAdmin</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Инструкции для тестирования */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          💡 Как протестировать MVP версию
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>1. ✅ Переключите языки в правом верхнем углу</p>
          <p>2. ✅ Откройте версию для слабовидящих (иконка глаза)</p>
          <p>3. ✅ Перейдите на публичную часть сайта</p>
          <p>4. ✅ Проверьте навигацию по страницам "О нас" и "Контакты"</p>
          <p>5. ✅ Убедитесь, что хлебные крошки работают</p>
          <p>
            6. ✅ Проверьте, что API возвращает данные:{" "}
            <code className="bg-blue-100 px-1 rounded">
              localhost:8000/api/v1/health
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
