<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SpecialistController;
use App\Http\Controllers\Api\SpecialistFileController;
use App\Http\Controllers\Api\TestRolesController;
use App\Http\Controllers\Api\Admin\IdentificationNumberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Публичные маршруты
Route::prefix('v1')->group(function () {
    // Страницы (оригинальные маршруты)
    Route::get('/pages', [PageController::class, 'index']);
    Route::get('/pages/home', [PageController::class, 'home']);
    Route::get('/pages/navigation', [PageController::class, 'navigation']);
    Route::get('/pages/{slug}', [PageController::class, 'show']);
    
    // Проверка состояния API
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'API работает корректно',
            'timestamp' => now(),
            'version' => '1.0.0',
            'features' => [
                'basic_cms' => true,
                'user_roles' => true,
                'multilingual' => true,
                'accessibility' => true,
                'specialist_profile' => true,
                'file_management' => true,
                'content_pages' => true,
                'clean_architecture' => true,
                'service_layer' => true,
            ]
        ]);
    });

    // Аутентификация
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register-specialist', [AuthController::class, 'registerSpecialist']);
    Route::post('/auth/check-id', [AuthController::class, 'checkIdentificationNumber']);
    
    // Тестовые эндпоинты для проверки ролей
    Route::get('/test/public', [TestRolesController::class, 'publicEndpoint']);
    Route::get('/test/roles-info', [TestRolesController::class, 'rolesInfo']);
});

// Защищенные маршруты (требуют аутентификации)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Общие маршруты для аутентифицированных пользователей
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Тестовые эндпоинты
    Route::get('/test/authenticated', [TestRolesController::class, 'authenticatedEndpoint']);
    
    // Маршруты для специалистов и админов
    Route::middleware('specialist')->group(function () {
        Route::get('/test/specialist', [TestRolesController::class, 'specialistEndpoint']);
        
        // Личный кабинет специалиста
        Route::prefix('specialist')->group(function () {
            // Профиль
            Route::get('/profile', [SpecialistController::class, 'profile']);
            Route::put('/profile', [SpecialistController::class, 'updateProfile']);
            
            // Смена пароля
            Route::post('/change-password', [SpecialistController::class, 'changePassword']);
            
            // Активность и статистика
            Route::get('/activity', [SpecialistController::class, 'activity']);
            
            // Настройки
            Route::get('/settings', [SpecialistController::class, 'settings']);
            Route::put('/settings', [SpecialistController::class, 'updateSettings']);

            // РЕФАКТОРИНГ: Унифицированный контент специалиста
            Route::get('/content', [SpecialistController::class, 'getAllContent']);
            
            // НОВЫЙ: Параметризованный маршрут для любого типа контента
            Route::get('/content/{type}', [SpecialistController::class, 'getContent'])
                ->where('type', 'legislation|information');

            // РЕФАКТОРИНГ: Работа с файлами
            Route::prefix('files')->name('api.specialist.file.')->group(function () {
                // Получить файлы по типу контента (унифицированный)
                Route::get('/by-type/{contentType}', [SpecialistFileController::class, 'getFilesByType'])
                    ->where('contentType', 'legislation|information');
                
                // Получить все файлы
                Route::get('/', [SpecialistFileController::class, 'getAllFiles']);
                
                // НОВЫЙ: Статистика файлов
                Route::get('/stats', [SpecialistFileController::class, 'getStats']);
                
                // Информация о конкретном файле
                Route::get('/{file}', [SpecialistFileController::class, 'show']);
                
                // Скачать файл
                Route::get('/{file}/download', [SpecialistFileController::class, 'download'])
                    ->name('download');
            });
        });
    });
    
    // Админские маршруты
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/test/admin', [TestRolesController::class, 'adminEndpoint']);
        
        // Управление ID номерами
        Route::get('/identification-numbers/stats', [IdentificationNumberController::class, 'stats']);
        Route::post('/identification-numbers/batch', [IdentificationNumberController::class, 'storeBatch']);
        Route::post('/identification-numbers/{identificationNumber}/release', [IdentificationNumberController::class, 'release']);
        Route::post('/identification-numbers/{identificationNumber}/toggle-status', [IdentificationNumberController::class, 'toggleStatus']);
        Route::apiResource('identification-numbers', IdentificationNumberController::class);
        
        // Пользователи (будет реализовано в следующих подэтапах)
        Route::get('/users', function () {
            return response()->json([
                'success' => true,
                'message' => 'Админский эндпоинт работает!',
                'note' => 'CRUD для пользователей будет добавлен в следующих подэтапах'
            ]);
        });

        // Управление контентом специалистов (заготовка для админки)
        Route::prefix('specialist-content')->group(function () {
            Route::get('/', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'Админское управление контентом специалистов',
                    'note' => 'CRUD для контента будет добавлен в следующих подэтапах'
                ]);
            });
        });

        // Управление файлами специалистов (заготовка для админки)
        Route::prefix('specialist-files')->group(function () {
            Route::get('/', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'Админское управление файлами специалистов',
                    'note' => 'CRUD для файлов будет добавлен в следующих подэтапах'
                ]);
            });
        });
    });
});

/*
|--------------------------------------------------------------------------
| DEPRECATED ROUTES (удалить после обновления frontend)
|--------------------------------------------------------------------------
| Эти маршруты оставлены для обратной совместимости
| и будут удалены после обновления frontend кода
*/

Route::middleware(['auth:sanctum', 'specialist'])->prefix('v1/specialist')->group(function () {
    // DEPRECATED: Используйте /content/{type} вместо этих маршрутов
    Route::get('/content/legislation', function (Request $request) {
        return app(SpecialistController::class)->getContent($request, 'legislation');
    })->name('api.specialist.content.legislation.deprecated');
    
    Route::get('/content/information', function (Request $request) {
        return app(SpecialistController::class)->getContent($request, 'information');
    })->name('api.specialist.content.information.deprecated');
});