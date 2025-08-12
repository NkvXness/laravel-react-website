<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SpecialistController; // ДОБАВЛЕНО
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
                'specialist_profile' => true, // ДОБАВЛЕНО
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
        
        // ДОБАВЛЕНО: Личный кабинет специалиста
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
    });
});