/**
 * Константы ролей пользователей
 */
export const USER_ROLES = {
  ADMIN: "admin",
  SPECIALIST: "specialist",
  USER: "user",
};

/**
 * Названия ролей для отображения
 */
export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: {
    ru: "Администратор",
    be: "Адміністратар",
    en: "Administrator",
  },
  [USER_ROLES.SPECIALIST]: {
    ru: "Специалист",
    be: "Спецыяліст",
    en: "Specialist",
  },
  [USER_ROLES.USER]: {
    ru: "Пользователь",
    be: "Карыстальнік",
    en: "User",
  },
};

/**
 * Проверка роли пользователя
 */
export const userHelpers = {
  // Проверки ролей
  isAdmin: (user) => user?.role === USER_ROLES.ADMIN,
  isSpecialist: (user) => user?.role === USER_ROLES.SPECIALIST,
  isUser: (user) => user?.role === USER_ROLES.USER,

  // Проверки доступа
  canAccessAdmin: (user) => user?.can_access_admin === true,
  canAccessProfile: (user) => user?.can_access_profile === true,

  // Получить название роли
  getRoleLabel: (user, locale = "ru") => {
    if (!user?.role) return "";
    return USER_ROLE_LABELS[user.role]?.[locale] || user.role;
  },

  // Получить полное имя
  getFullName: (user) => {
    if (!user) return "";
    return (
      user.full_name ||
      `${user.first_name || ""} ${user.last_name || ""}`.trim()
    );
  },

  // ДОБАВЛЕНО: Получить полную информацию о специалисте
  getFullSpecialistInfo: (user) => {
    if (!user) return "";
    const fullName = userHelpers.getFullName(user);

    if (user.hospital_name && userHelpers.isSpecialist(user)) {
      return `${fullName} (${user.hospital_name})`;
    }

    return fullName;
  },

  // Получить инициалы
  getInitials: (user) => {
    if (!user) return "";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  },

  // Проверить активность пользователя
  isActive: (user) => user?.is_active !== false,
};

/**
 * Начальное состояние пользователя
 */
export const initialUserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * ОБНОВЛЕНО: Валидация данных пользователя
 */
export const userValidation = {
  // Валидация email
  email: (email) => {
    if (!email) return "Email обязателен";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Некорректный email";
    return null;
  },

  // Валидация пароля
  password: (password) => {
    if (!password) return "Пароль обязателен";
    if (password.length < 8)
      return "Пароль должен содержать минимум 8 символов";
    return null;
  },

  // Валидация имени
  firstName: (firstName) => {
    if (!firstName) return "Имя обязательно";
    if (firstName.length < 2) return "Имя должно содержать минимум 2 символа";
    if (firstName.length > 50) return "Имя не должно превышать 50 символов";
    if (!/^[а-яёa-z\s-]+$/iu.test(firstName)) {
      return "Имя может содержать только буквы, пробелы и дефисы";
    }
    return null;
  },

  // Валидация фамилии
  lastName: (lastName) => {
    if (!lastName) return "Фамилия обязательна";
    if (lastName.length < 2)
      return "Фамилия должна содержать минимум 2 символа";
    if (lastName.length > 50) return "Фамилия не должна превышать 50 символов";
    if (!/^[а-яёa-z\s-]+$/iu.test(lastName)) {
      return "Фамилия может содержать только буквы, пробелы и дефисы";
    }
    return null;
  },

  // ДОБАВЛЕНО: Валидация названия ЦРБ
  hospitalName: (hospitalName) => {
    if (!hospitalName) return "Название ЦРБ обязательно";
    if (hospitalName.length < 5)
      return "Название ЦРБ должно содержать минимум 5 символов";
    if (hospitalName.length > 255)
      return "Название ЦРБ не должно превышать 255 символов";
    if (!/^[а-яёa-z0-9\s№"«»()./"-]+$/iu.test(hospitalName)) {
      return "Название ЦРБ содержит недопустимые символы";
    }
    return null;
  },

  // Валидация ID номера
  identificationNumber: (idNumber) => {
    if (!idNumber) return "Идентификационный номер обязателен";
    if (idNumber.length < 3)
      return "ID номер должен содержать минимум 3 символа";
    if (idNumber.length > 50) return "ID номер не должен превышать 50 символов";
    if (!/^[A-Za-z0-9\-_]+$/.test(idNumber)) {
      return "ID номер может содержать только буквы, цифры, дефисы и подчеркивания";
    }
    return null;
  },

  // Валидация подтверждения пароля
  passwordConfirmation: (password, confirmation) => {
    if (!confirmation) return "Подтверждение пароля обязательно";
    if (password !== confirmation) return "Пароли не совпадают";
    return null;
  },
};

/**
 * ДОБАВЛЕНО: Примеры названий ЦРБ для подсказок
 */
export const HOSPITAL_NAME_EXAMPLES = [
  'ГУЗ "Центральная районная больница г. Гомеля"',
  'УЗ "Гомельская центральная районная больница"',
  'УЗ "Гомельская областная клиническая больница"',
  'ГУЗ "Гомельский областной клинический специализированный центр"',
  'УЗ "Гомельская центральная районная больница"',
  'ГУЗ "Гомельская университетская клиника"',
];

export default {
  USER_ROLES,
  USER_ROLE_LABELS,
  userHelpers,
  initialUserState,
  userValidation,
  HOSPITAL_NAME_EXAMPLES,
};
