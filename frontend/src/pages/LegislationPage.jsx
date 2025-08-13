import { Scale, FileText, BookOpen } from "lucide-react";
import SpecialistContentPage from "../shared/ui/SpecialistContentPage/SpecialistContentPage";

/**
 * Упрощенная страница законодательства для специалистов
 * Использует переиспользуемый компонент SpecialistContentPage
 */
const LegislationPage = () => {
  // Конфигурация предупреждения
  const alertConfig = {
    type: "warning",
    title: "Важная информация",
    className: "border-amber-300 bg-amber-50",
    iconClassName: "text-amber-400",
    content: (
      <div>
        <p className="text-amber-800">
          Документы в этом разделе содержат актуальные нормативно-правовые акты
          и методические рекомендации для специалистов наркологической службы.
        </p>
      </div>
    ),
  };

  // Дополнительная информация
  const additionalInfo = (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 text-blue-500 mr-2" />
        Информация о разделе
      </h2>

      <div className="prose prose-sm max-w-none text-gray-600">
        <h3 className="text-base font-medium text-gray-900 mb-2">
          Как пользоваться разделом:
        </h3>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Используйте поиск для быстрого нахождения нужного документа</li>
          <li>Сортируйте документы по дате или названию</li>
          <li>Скачивайте документы для работы в автономном режиме</li>
          <li>Регулярно проверяйте обновления</li>
        </ul>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Обратите внимание:</strong> Все документы в разделе
            актуальны на момент их размещения.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <SpecialistContentPage
      contentType="legislation"
      title="Законодательство и нормативные документы"
      description="В данном разделе размещены нормативно-правовые акты и другие документы, регламентирующие деятельность специалистов наркологической службы."
      icon={Scale}
      alertConfig={alertConfig}
      additionalInfo={additionalInfo}
    />
  );
};

export default LegislationPage;
