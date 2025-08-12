import { Navigate } from "react-router-dom";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { useIsAuthenticated } from "../entities/user/model/store";
import RegisterSpecialistForm from "../features/auth-register-specialist/ui/RegisterSpecialistForm";

/**
 * Страница регистрации специалиста
 * Pages слой в Feature-Sliced Design
 */
const RegisterPage = () => {
  const isAuthenticated = useIsAuthenticated();

  // SEO мета-теги
  useDocumentHead({
    title: "Регистрация специалиста - Медицинский центр",
    description:
      "Регистрация для специалистов медицинского центра по идентификационному номеру",
    canonical: `${window.location.origin}/register`,
  });

  // Если пользователь уже авторизован, перенаправляем
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - информация для специалистов */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 relative">
        <div className="flex items-center justify-center w-full p-12">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">👨‍⚕️</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Присоединяйтесь к команде
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Для специалистов медицинского центра
            </p>

            <div className="space-y-6 text-left max-w-md">
              <div>
                <h3 className="text-lg font-semibold text-green-100 mb-2">
                  Что вам доступно:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-green-100">
                      Личный кабинет с персональными данными
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-green-100">
                      Доступ к специальным документам и инструкциям
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-green-100">
                      Персональные файлы для скачивания
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-green-100">
                      Обновления рабочих материалов
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-green-500 pt-6">
                <h3 className="text-lg font-semibold text-green-100 mb-2">
                  Для регистрации нужен:
                </h3>
                <p className="text-green-100">
                  Идентификационный номер, выданный администрацией медицинского
                  центра
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - форма регистрации */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Мобильный заголовок */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">👨‍⚕️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Регистрация специалиста
            </h1>
            <p className="text-gray-600">Для сотрудников медицинского центра</p>
          </div>

          {/* Форма регистрации */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <RegisterSpecialistForm />
          </div>

          {/* Информация о помощи */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Не можете найти свой идентификационный номер? <br />
              Обратитесь к администратору медицинского центра
            </p>
          </div>

          {/* Контактная информация */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Служба поддержки
            </h3>
            <div className="space-y-1 text-xs text-blue-700">
              <p>📞 +375 (XX) XXX-XX-XX</p>
              <p>✉️ admin@medical-center.local</p>
              <p className="text-blue-600">
                * Контакты будут настроены через CMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
