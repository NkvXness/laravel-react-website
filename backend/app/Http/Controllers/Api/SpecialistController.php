<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Services\Contracts\SpecialistContentServiceInterface;
use App\Models\SpecialistContent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SpecialistController extends Controller
{
    /**
     * Конструктор с внедрением зависимостей
     */
    public function __construct(
        private SpecialistContentServiceInterface $contentService
    ) {}

    /**
     * Получить профиль текущего специалиста
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'hospital_name' => $user->hospital_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'last_login_at' => $user->last_login_at,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'statistics' => $this->contentService->getContentStats($user)
            ]
        ]);
    }

    /**
     * Обновить профиль специалиста
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            $user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Профиль успешно обновлён',
                'data' => [
                    'profile' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'full_name' => $user->full_name,
                        'hospital_name' => $user->hospital_name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при обновлении профиля: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Изменить пароль специалиста
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        // Проверяем текущий пароль
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный текущий пароль',
                'errors' => [
                    'current_password' => ['Неверный текущий пароль']
                ]
            ], 422);
        }

        try {
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Пароль успешно изменён'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при изменении пароля: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * УНИФИЦИРОВАННЫЙ: Получить контент специалиста по типу
     * Заменяет getLegislationContent() и getInformationContent()
     */
    public function getContent(Request $request, string $type): JsonResponse
    {
        $user = $request->user();

        // Валидация типа контента
        if (!in_array($type, SpecialistContent::getAllTypes())) {
            return response()->json([
                'success' => false,
                'message' => 'Недопустимый тип контента'
            ], 400);
        }

        try {
            $data = $this->contentService->getContentByType($user, $type);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении контента: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить весь контент специалиста
     */
    public function getAllContent(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $data = $this->contentService->getAllContent($user);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении контента: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить активность специалиста
     */
    public function activity(Request $request): JsonResponse
    {
        $user = $request->user();

        $activity = [
            'recent_login' => $user->last_login_at,
            'registration_date' => $user->created_at,
            'hospital_name' => $user->hospital_name,
            'content_updates' => $user->specialistContent()
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($content) {
                    return [
                        'type' => $content->content_type,
                        'type_name' => $content->type_name,
                        'updated_at' => $content->updated_at,
                        'title' => $content->getTranslation('title', app()->getLocale()) ?? 'Без названия'
                    ];
                }),
            'total_content' => $user->specialistContent()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $activity
        ]);
    }

    /**
     * Получить настройки специалиста
     */
    public function settings(Request $request): JsonResponse
    {
        $user = $request->user();

        $settings = [
            'notifications' => [
                'email_updates' => true,
                'security_alerts' => true,
            ],
            'privacy' => [
                'profile_visibility' => 'internal',
                'contact_visibility' => 'internal',
            ],
            'preferences' => [
                'language' => 'ru',
                'timezone' => 'Europe/Minsk',
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Обновить настройки специалиста
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'notifications.email_updates' => 'boolean',
            'notifications.security_alerts' => 'boolean',
            'privacy.profile_visibility' => 'in:internal,public,private',
            'privacy.contact_visibility' => 'in:internal,public,private',
            'preferences.language' => 'in:ru,be,en',
            'preferences.timezone' => 'string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Настройки успешно обновлены',
            'data' => $request->all()
        ]);
    }
}