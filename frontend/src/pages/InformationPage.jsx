import { Info, BookOpen, Lightbulb } from "lucide-react";
import SpecialistContentPage from "../shared/ui/SpecialistContentPage/SpecialistContentPage";

/**
 * Упрощенная страница информационных материалов для специалистов
 * Использует переиспользуемый компонент SpecialistContentPage
 */
const InformationPage = () => {
  // Конфигурация информационного блока
  const alertConfig = {
    type: "info",
    title: "Полезные материалы",
    className: "border-blue-300 bg-blue-50",
    iconClassName: "text-blue-400",
    content: (
      <div>
        <p className="text-blue-800 mt-2 text-sm">
          Регулярно проверяйте обновления в данном разделе для получения
          актуальной информации.
        </p>
      </div>
    ),
  };

  // Дополнительная информация
  const additionalInfo = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Категории материалов */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 text-green-500 mr-2" />
          Категории материалов
        </h2>

        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-900">Справочники</h3>
            <p className="text-sm text-gray-600">
              Медицинские справочники, классификаторы, перечни препаратов
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-gray-900">Инструкции</h3>
            <p className="text-sm text-gray-600">
              Инструкции по работе с оборудованием, алгоритмы действий
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium text-gray-900">Обучающие материалы</h3>
            <p className="text-sm text-gray-600">
              Презентации, видеоматериалы, курсы повышения квалификации
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium text-gray-900">Формы и бланки</h3>
            <p className="text-sm text-gray-600">
              Документооборот, отчетные формы, шаблоны документов
            </p>
          </div>
        </div>
      </div>

      {/* Рекомендации по использованию */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          Рекомендации по использованию
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              📚 Изучение материалов
            </h3>
            <p className="text-sm text-gray-600">
              Регулярно изучайте новые материалы для повышения квалификации и
              улучшения качества медицинской помощи.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              💾 Скачивание документов
            </h3>
            <p className="text-sm text-gray-600">
              Скачивайте важные документы для работы в автономном режиме и
              быстрого доступа к информации.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              🔍 Поиск информации
            </h3>
            <p className="text-sm text-gray-600">
              Используйте функцию поиска для быстрого нахождения нужных
              материалов по ключевым словам.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              📋 Обратная связь
            </h3>
            <p className="text-sm text-gray-600">
              При необходимости дополнительных материалов обращайтесь к
              администратору системы.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Полезные ссылки
  const usefulLinks = (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🔗 Полезные ссылки для специалистов
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="https://minzdrav.gov.by"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium text-blue-900">
            Министерство здравоохранения
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Официальный сайт Минздрава РБ
          </p>
        </a>

        <a
          href="https://rcheph.by"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium text-blue-900">
            РНПЦ эпидемиологии и микробиологии
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Научные исследования и методики
          </p>
        </a>

        <a
          href="#"
          className="block p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow opacity-75 cursor-not-allowed"
        >
          <h3 className="font-medium text-blue-900">Медицинская библиотека</h3>
          <p className="text-sm text-blue-700 mt-1">
            Научные публикации и исследования
          </p>
        </a>
      </div>
    </div>
  );

  return (
    <SpecialistContentPage
      contentType="information"
      title="Информационные материалы и справочники"
      description="Здесь размещены справочные материалы, инструкции другие документы, необходимые для профессиональной деятельности специалистов."
      icon={Lightbulb}
      alertConfig={alertConfig}
      additionalInfo={
        <div>
          {additionalInfo}
          {usefulLinks}
        </div>
      }
    />
  );
};

export default InformationPage;
