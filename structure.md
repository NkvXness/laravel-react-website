```
ugond.loc
├─ backend
│  ├─ .editorconfig
│  ├─ app
│  │  ├─ Http
│  │  │  ├─ Controllers
│  │  │  │  ├─ Api
│  │  │  │  │  ├─ Admin
│  │  │  │  │  │  └─ IdentificationNumberController.php
│  │  │  │  │  ├─ AuthController.php
│  │  │  │  │  ├─ PageController.php
│  │  │  │  │  ├─ SpecialistController.php
│  │  │  │  │  ├─ SpecialistFileController.php
│  │  │  │  │  └─ TestRolesController.php
│  │  │  │  └─ Controller.php
│  │  │  ├─ Middleware
│  │  │  │  ├─ AdminMiddleware.php
│  │  │  │  └─ SpecialistMiddleware.php
│  │  │  ├─ Requests
│  │  │  │  ├─ ChangePasswordRequest.php
│  │  │  │  ├─ RegisterSpecialistRequest.php
│  │  │  │  └─ UpdateProfileRequest.php
│  │  │  └─ Resources
│  │  │     ├─ SpecialistContentResource.php
│  │  │     └─ SpecialistFileResource.php
│  │  ├─ Models
│  │  │  ├─ IdentificationNumber.php
│  │  │  ├─ Page.php
│  │  │  ├─ SpecialistContent.php
│  │  │  ├─ SpecialistFile.php
│  │  │  └─ User.php
│  │  ├─ Providers
│  │  │  └─ AppServiceProvider.php
│  │  └─ Services
│  │     ├─ Contracts
│  │     │  ├─ SpecialistContentServiceInterface.php
│  │     │  └─ SpecialistFileServiceInterface.php
│  │     ├─ SpecialistContentService.php
│  │     └─ SpecialistFileService.php
│  ├─ artisan
│  ├─ bootstrap
│  │  ├─ app.php
│  │  └─ providers.php
│  ├─ composer.json
│  ├─ composer.lock
│  ├─ config
│  │  ├─ app.php
│  │  ├─ auth.php
│  │  ├─ cache.php
│  │  ├─ cors.php
│  │  ├─ database.php
│  │  ├─ filesystems.php
│  │  ├─ logging.php
│  │  ├─ mail.php
│  │  ├─ queue.php
│  │  ├─ sanctum.php
│  │  ├─ services.php
│  │  └─ session.php
│  ├─ database
│  │  ├─ factories
│  │  │  └─ UserFactory.php
│  │  ├─ migrations
│  │  │  ├─ 2025_08_10_084536_create_personal_access_tokens_table.php
│  │  │  ├─ 2025_08_10_120307_create_pages_table.php
│  │  │  ├─ 2025_08_10_135920_create_users_table.php
│  │  │  ├─ 2025_08_10_172243_create_specialist_content_table.php
│  │  │  ├─ 2025_08_10_172331_create_specialist_files_table.php
│  │  │  ├─ 2025_08_11_140845_create_identification_numbers_table.php
│  │  │  └─ 2025_08_12_120910_update_specialist_content_types.php
│  │  └─ seeders
│  │     ├─ DatabaseSeeder.php
│  │     ├─ IdentificationNumbersSeeder.php
│  │     ├─ PageSeeder.php
│  │     ├─ SpecialistContentSeeder.php
│  │     └─ UsersSeeder.php
│  ├─ package.json
│  ├─ phpunit.xml
│  ├─ public
│  │  ├─ .htaccess
│  │  ├─ favicon.ico
│  │  ├─ index.php
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ resources
│  │  ├─ css
│  │  │  └─ app.css
│  │  ├─ js
│  │  │  ├─ app.js
│  │  │  └─ bootstrap.js
│  │  └─ views
│  │     └─ welcome.blade.php
│  ├─ routes
│  │  ├─ api.php
│  │  ├─ console.php
│  │  └─ web.php
│  ├─ storage
│  │  ├─ app
│  │  │  ├─ private
│  │  │  └─ public
│  │  └─ framework
│  │     └─ cache
│  ├─ tests
│  │  ├─ Feature
│  │  │  └─ ExampleTest.php
│  │  ├─ TestCase.php
│  │  └─ Unit
│  │     └─ ExampleTest.php
│  └─ vite.config.js
├─ docs
│  ├─ mvp-readme.md
│  ├─ setup-commands.md
│  ├─ step2-documentation.md
│  ├─ команды для работы с миграциями laravel.md
│  ├─ план реализации шага 2.md
│  ├─ промпт для шага 2.1.5.txt
│  ├─ техническая документация.md
│  └─ шпаргалка по архитектуре.md
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ app
│  │  │  └─ providers
│  │  │     └─ AuthProvider.jsx
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ AccessibilityPanel.jsx
│  │  │  ├─ Admin
│  │  │  │  └─ AdminLayout.jsx
│  │  │  ├─ Breadcrumbs.jsx
│  │  │  ├─ LanguageSwitcher.jsx
│  │  │  └─ Layout
│  │  │     ├─ Footer.jsx
│  │  │     ├─ Header.jsx
│  │  │     ├─ Layout.jsx
│  │  │     └─ Navigation.jsx
│  │  ├─ entities
│  │  │  └─ user
│  │  │     ├─ api
│  │  │     │  ├─ documentsApi.js
│  │  │     │  └─ profileApi.js
│  │  │     └─ model
│  │  │        ├─ store.js
│  │  │        └─ types.js
│  │  ├─ features
│  │  │  ├─ auth-login
│  │  │  │  └─ ui
│  │  │  │     └─ LoginForm.jsx
│  │  │  ├─ auth-register-specialist
│  │  │  │  └─ ui
│  │  │  │     └─ RegisterSpecialistForm.jsx
│  │  │  ├─ document-viewer
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useSpecialistContent.js
│  │  │  │  ├─ index.js
│  │  │  │  └─ ui
│  │  │  │     └─ DocumentViewer.jsx
│  │  │  ├─ file-download
│  │  │  │  ├─ index.js
│  │  │  │  └─ ui
│  │  │  │     └─ FileDownload.jsx
│  │  │  ├─ password-change
│  │  │  │  ├─ index.js
│  │  │  │  └─ ui
│  │  │  │     └─ PasswordChangeForm.jsx
│  │  │  └─ profile-edit
│  │  │     ├─ index.js
│  │  │     └─ ui
│  │  │        └─ ProfileEditForm.jsx
│  │  ├─ hooks
│  │  │  ├─ useDocumentHead.js
│  │  │  └─ usePages.js
│  │  ├─ i18n
│  │  │  └─ config.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Admin
│  │  │  │  └─ AdminDashboard.jsx
│  │  │  ├─ DynamicPage.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ InformationPage.jsx
│  │  │  ├─ LegislationPage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotFoundPage.jsx
│  │  │  ├─ ProfilePage.jsx
│  │  │  └─ RegisterPage.jsx
│  │  ├─ shared
│  │  │  ├─ api
│  │  │  │  ├─ auth.js
│  │  │  │  ├─ client.js
│  │  │  │  └─ pages.js
│  │  │  └─ ui
│  │  │     ├─ Alert
│  │  │     │  └─ Alert.jsx
│  │  │     ├─ Button
│  │  │     │  └─ Button.jsx
│  │  │     ├─ Input
│  │  │     │  └─ Input.jsx
│  │  │     ├─ Modal
│  │  │     │  └─ Modal.jsx
│  │  │     ├─ ProtectedRoute
│  │  │     │  └─ ProtectedRoute.jsx
│  │  │     ├─ QuickDocumentLinks
│  │  │     │  ├─ index.js
│  │  │     │  └─ QuickDocumentLinks.jsx
│  │  │     └─ SpecialistContentPage
│  │  │        ├─ index.js
│  │  │        └─ SpecialistContentPage.jsx
│  │  └─ widgets
│  │     └─ profile-dashboard
│  │        ├─ index.js
│  │        └─ ProfileDashboard.jsx
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ structure.md
├─ исправления.txt
└─ Текстовый документ.txt
```