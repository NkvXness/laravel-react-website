<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestRolesController extends Controller
{
    /**
     * Публичный эндпоинт (доступен всем)
     */
    public function publicEndpoint(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Это публичный эндпоинт, доступен всем',
            'timestamp' => now(),
            'access_level' => 'public'
        ]);
    }

    /**
     * Эндпоинт для авторизованных пользователей
     */
    public function authenticatedEndpoint(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Доступ для авторизованного пользователя',
            'timestamp' => now(),
            'access_level' => 'authenticated',
            'user_info' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'role' => $user->role,
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Эндпоинт только для специалистов
     */
    public function specialistEndpoint(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Доступ только для специалистов и админов',
            'timestamp' => now(),
            'access_level' => 'specialist',
            'user_info' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'role' => $user->role,
                'can_access_profile' => $user->canAccessProfile(),
            ]
        ]);
    }

    /**
     * Эндпоинт только для админов
     */
    public function adminEndpoint(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Доступ только для администраторов',
            'timestamp' => now(),
            'access_level' => 'admin',
            'user_info' => [
                'id' => $user->id,
                'name' => $user->full_name,
                'role' => $user->role,
                'can_access_admin' => $user->canAccessAdmin(),
            ]
        ]);
    }

    /**
     * Получить информацию о системе ролей
     */
    public function rolesInfo(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Информация о системе ролей',
            'data' => [
                'available_roles' => [
                    'admin' => [
                        'name' => 'Администратор',
                        'description' => 'Полный доступ к системе',
                        'permissions' => [
                            'manage_users',
                            'manage_content', 
                            'access_admin_panel',
                            'view_all_data'
                        ]
                    ],
                    'specialist' => [
                        'name' => 'Специалист',
                        'description' => 'Сотрудник с ограниченными правами',
                        'permissions' => [
                            'access_profile',
                            'view_personal_content',
                            'download_documents'
                        ]
                    ],
                    'user' => [
                        'name' => 'Пользователь',
                        'description' => 'Обычный посетитель',
                        'permissions' => [
                            'view_public_content'
                        ]
                    ]
                ],
                'endpoints' => [
                    'public' => '/api/v1/test/public',
                    'authenticated' => '/api/v1/test/authenticated',
                    'specialist' => '/api/v1/test/specialist',
                    'admin' => '/api/v1/test/admin',
                ]
            ]
        ]);
    }
}