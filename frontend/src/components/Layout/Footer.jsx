import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../../hooks/usePages";

const Footer = () => {
  const { t } = useTranslation();
  const { data: navigationData } = useNavigation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Информация о медицинском центре */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Медицинский центр</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Профессиональная наркологическая помощь. Квалифицированные
                специалисты и современные методы лечения.
              </p>
            </div>

            {/* Навигация */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Навигация</h3>
              <nav className="space-y-2">
                <Link
                  to="/"
                  className="block text-gray-300 hover:text-white focus:outline-none focus:text-white text-sm"
                >
                  {t("navigation.home")}
                </Link>
                {navigationData &&
                  navigationData.map((page) => (
                    <Link
                      key={page.slug}
                      to={`/${page.slug}`}
                      className="block text-gray-300 hover:text-white focus:outline-none focus:text-white text-sm"
                    >
                      {page.title}
                    </Link>
                  ))}
              </nav>
            </div>

            {/* Контактная информация */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>Телефон: +375 (XX) XXX-XX-XX</p>
                <p>Email: info@medical-center.by</p>
                <p>Адрес: г. Минск, ул. Примерная, 1</p>
                <p className="text-xs text-gray-400 mt-4">
                  * Контактная информация будет настроена через CMS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-gray-700 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Медицинский центр. Все права
              защищены.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                to="/admin"
                className="text-gray-400 hover:text-white text-xs focus:outline-none focus:text-white"
              >
                Админ-панель
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
