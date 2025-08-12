<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\IdentificationNumber;
use App\Http\Requests\RegisterSpecialistRequest; // ДОБАВЛЕНО
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Вход в систему
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Неверные учетные данные'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Аккаунт заблокирован. Обратитесь к администратору.'
            ], 403);
        }

        // Обновляем время последнего входа
        $user->updateLastLoginTime();

        // Создаем токен
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Успешный вход в систему',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_admin' => $user->isAdmin(),
                    'is_specialist' => $user->isSpecialist(),
                    'can_access_admin' => $user->canAccessAdmin(),
                    'can_access_profile' => $user->canAccessProfile(),
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * ОБНОВЛЕНО: Регистрация специалиста с использованием Request класса
     */
    public function registerSpecialist(RegisterSpecialistRequest $request): JsonResponse
    {
        // Находим доступный идентификационный номер
        $idNumber = IdentificationNumber::findAvailable($request->identification_number);

        if (!$idNumber) {
            return response()->json([
                'success' => false,
                'message' => 'Недействительный или уже использованный идентификационный номер'
            ], 400);
        }

        try {
            \DB::beginTransaction();

            // ОБНОВЛЕНО: Создаем пользователя с названием ЦРБ
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'hospital_name' => $request->hospital_name, // ДОБАВЛЕНО
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => User::ROLE_SPECIALIST,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            // Помечаем номер как использованный
            $idNumber->markAsUsed($user);

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Регистрация успешно завершена',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'full_name' => $user->full_name,
                        'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
                        'email' => $user->email,
                        'role' => $user->role,
                        'identification_number' => $idNumber->number,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            \DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при регистрации: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Выход из системы
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Выход из системы выполнен успешно'
        ]);
    }

    /**
     * ОБНОВЛЕНО: Получить данные текущего пользователя
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'hospital_name' => $user->hospital_name, // ДОБАВЛЕНО
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_admin' => $user->isAdmin(),
                    'is_specialist' => $user->isSpecialist(),
                    'can_access_admin' => $user->canAccessAdmin(),
                    'can_access_profile' => $user->canAccessProfile(),
                    'last_login_at' => $user->last_login_at,
                ]
            ]
        ]);
    }

    /**
     * Проверить существование идентификационного номера
     */
    public function checkIdentificationNumber(Request $request): JsonResponse
    {
        $request->validate([
            'identification_number' => 'required|string',
        ]);

        $isAvailable = IdentificationNumber::isNumberAvailable($request->identification_number);

        if (!$isAvailable) {
            $idNumber = IdentificationNumber::where('number', $request->identification_number)->first();
            
            if (!$idNumber) {
                return response()->json([
                    'success' => false,
                    'message' => 'Идентификационный номер не найден'
                ], 404);
            }

            if ($idNumber->is_used) {
                return response()->json([
                    'success' => false,
                    'message' => 'Идентификационный номер уже использован'
                ], 400);
            }

            if (!$idNumber->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Идентификационный номер деактивирован'
                ], 400);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Идентификационный номер действителен',
            'data' => [
                'can_register' => true,
                'description' => IdentificationNumber::where('number', $request->identification_number)->first()?->description
            ]
        ]);
    }
}