import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Компонент быстрых ссылок на документы специалиста
 * Обеспечивает быстрый доступ к законодательству и информации
 */
const QuickDocumentLinks = ({ className = "" }) => {
  const documentLinks = [
    {
      to: "/profile/legislation",
      icon: "⚖️",
      title: "Законодательство",
      description: "Нормативные документы и законы",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      hoverColor: "hover:bg-blue-100",
    },
    {
      to: "/profile/information",
      icon: "📚",
      title: "Информация",
      description: "Справочные материалы и инструкции",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      hoverColor: "hover:bg-green-100",
    },
  ];

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Быстрый доступ к документам
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {documentLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              group block p-4 rounded-lg border-2 transition-all duration-200
              ${link.bgColor} ${link.borderColor} ${link.hoverColor}
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{link.icon}</div>
                <div>
                  <h4 className={`font-medium ${link.textColor}`}>
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {link.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 ${link.textColor} group-hover:translate-x-1 transition-transform`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickDocumentLinks;
