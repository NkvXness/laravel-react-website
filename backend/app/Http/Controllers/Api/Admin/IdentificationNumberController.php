<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\IdentificationNumber;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IdentificationNumberController extends Controller
{
    /**
     * Получить список всех ID номеров
     */
    public function index(Request $request): JsonResponse
    {
        $query = IdentificationNumber::with('user');

        // Фильтры
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'available':
                    $query->available();
                    break;
                case 'used':
                    $query->used();
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
            }
        }

        // Поиск
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Сортировка
        $sortBy = $request->get('sort_by', 'number');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Пагинация
        $perPage = $request->get('per_page', 15);
        $numbers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $numbers->items(),
            'pagination' => [
                'current_page' => $numbers->currentPage(),
                'per_page' => $numbers->perPage(),
                'total' => $numbers->total(),
                'last_page' => $numbers->lastPage(),
            ],
            'stats' => IdentificationNumber::getStats()
        ]);
    }

    /**
     * Создать новый ID номер
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'number' => 'required|string|unique:identification_numbers,number',
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $idNumber = IdentificationNumber::create([
            'number' => strtoupper($request->number),
            'description' => $request->description,
            'is_active' => $request->get('is_active', true),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ID номер успешно создан',
            'data' => $idNumber
        ], 201);
    }

    /**
     * Создать несколько ID номеров за раз
     */
    public function storeBatch(Request $request): JsonResponse
    {
        $request->validate([
            'prefix' => 'required|string|max:10',
            'start' => 'required|integer|min:1',
            'end' => 'required|integer|min:1|gte:start',
            'description' => 'nullable|string|max:255',
        ]);

        if ($request->end - $request->start > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Нельзя создать более 100 номеров за раз'
            ], 400);
        }

        $created = IdentificationNumber::createBatch(
            strtoupper($request->prefix),
            $request->start,
            $request->end,
            $request->description
        );

        return response()->json([
            'success' => true,
            'message' => "Создано {$created} ID номеров",
            'data' => ['created_count' => $created]
        ]);
    }

    /**
     * Получить информацию об ID номере
     */
    public function show(IdentificationNumber $identificationNumber): JsonResponse
    {
        $identificationNumber->load('user');

        return response()->json([
            'success' => true,
            'data' => $identificationNumber
        ]);
    }

    /**
     * Обновить ID номер
     */
    public function update(Request $request, IdentificationNumber $identificationNumber): JsonResponse
    {
        $request->validate([
            'number' => 'required|string|unique:identification_numbers,number,' . $identificationNumber->id,
            'description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $identificationNumber->update([
            'number' => strtoupper($request->number),
            'description' => $request->description,
            'is_active' => $request->get('is_active', $identificationNumber->is_active),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ID номер успешно обновлен',
            'data' => $identificationNumber
        ]);
    }

    /**
     * Удалить ID номер
     */
    public function destroy(IdentificationNumber $identificationNumber): JsonResponse
    {
        if ($identificationNumber->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'Нельзя удалить использованный ID номер'
            ], 400);
        }

        $identificationNumber->delete();

        return response()->json([
            'success' => true,
            'message' => 'ID номер успешно удален'
        ]);
    }

    /**
     * Освободить использованный ID номер
     */
    public function release(IdentificationNumber $identificationNumber): JsonResponse
    {
        if (!$identificationNumber->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'ID номер не используется'
            ], 400);
        }

        $user = $identificationNumber->user;
        $identificationNumber->release();

        return response()->json([
            'success' => true,
            'message' => "ID номер освобожден от пользователя {$user->full_name}",
            'data' => $identificationNumber->fresh()
        ]);
    }

    /**
     * Активировать/деактивировать ID номер
     */
    public function toggleStatus(IdentificationNumber $identificationNumber): JsonResponse
    {
        $identificationNumber->update([
            'is_active' => !$identificationNumber->is_active
        ]);

        $status = $identificationNumber->is_active ? 'активирован' : 'деактивирован';

        return response()->json([
            'success' => true,
            'message' => "ID номер {$status}",
            'data' => $identificationNumber
        ]);
    }

    /**
     * Получить статистику по ID номерам
     */
    public function stats(): JsonResponse
    {
        $stats = IdentificationNumber::getStats();
        
        // Дополнительная статистика
        $departmentStats = IdentificationNumber::selectRaw("
            SUBSTRING(number, 1, 4) as department,
            COUNT(*) as total,
            SUM(CASE WHEN is_used = 1 THEN 1 ELSE 0 END) as used,
            SUM(CASE WHEN is_active = 1 AND is_used = 0 THEN 1 ELSE 0 END) as available
        ")
        ->groupBy('department')
        ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'overall' => $stats,
                'by_department' => $departmentStats
            ]
        ]);
    }
}