<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SpecialistController extends Controller
{
    /**
     * ОБНОВЛЕНО: Получить профиль текущего специалиста
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
                    'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'last_login_at' => $user->last_login_at,
                    'email_verified_at' => $user->email_verified_at,
                ],
                'statistics' => [
                    'content_pages' => $user->specialistContent()->count(),
                    'total_files' => $user->specialistContent()
                        ->withCount('files')
                        ->get()
                        ->sum('files_count'),
                    'profile_completion' => $this->calculateProfileCompletion($user),
                ]
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
                        'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
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
     * Получить активность специалиста
     */
    public function activity(Request $request): JsonResponse
    {
        $user = $request->user();

        $activity = [
            'recent_login' => $user->last_login_at,
            'registration_date' => $user->created_at,
            'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
            'content_updates' => $user->specialistContent()
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($content) {
                    return [
                        'type' => $content->content_type,
                        'updated_at' => $content->updated_at,
                        'title' => $content->title['ru'] ?? 'Без названия'
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
                'email_updates' => true, // Можно добавить поле в БД
                'security_alerts' => true,
            ],
            'privacy' => [
                'profile_visibility' => 'internal', // internal, public, private
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

        // Здесь можно сохранить настройки в БД
        // Пока возвращаем успешный ответ

        return response()->json([
            'success' => true,
            'message' => 'Настройки успешно обновлены',
            'data' => $request->all()
        ]);
    }

    /**
     * ОБНОВЛЕНО: Вычислить процент заполнения профиля
     */
    private function calculateProfileCompletion($user): int
    {
        $fields = [
            'first_name' => !empty($user->first_name),
            'last_name' => !empty($user->last_name),
            'hospital_name' => !empty($user->hospital_name), // ДОБАВЛЕНО
            'email' => !empty($user->email),
            'email_verified' => !is_null($user->email_verified_at),
        ];

        $completedFields = array_filter($fields);
        $totalFields = count($fields);
        $completedCount = count($completedFields);

        return round(($completedCount / $totalFields) * 100);
    }
}