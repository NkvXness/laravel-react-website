<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SpecialistFile;
use App\Services\Contracts\SpecialistFileServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SpecialistFileController extends Controller
{
    /**
     * Конструктор с внедрением зависимостей
     */
    public function __construct(
        private SpecialistFileServiceInterface $fileService
    ) {}

    /**
     * Получить файлы специалиста по типу контента
     */
    public function getFilesByType(Request $request, string $contentType): JsonResponse
    {
        $user = $request->user();

        try {
            $data = $this->fileService->getFilesByContentType($user, $contentType);

            // Проверяем на ошибку валидации
            if (isset($data['success']) && !$data['success']) {
                return response()->json($data, 400);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении файлов: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Скачать файл
     */
    public function download(Request $request, SpecialistFile $file): BinaryFileResponse|JsonResponse
    {
        $user = $request->user();

        // Проверяем доступ к файлу
        if (!$this->fileService->canAccessFile($file, $user)) {
            return response()->json([
                'success' => false,
                'message' => 'У вас нет доступа к этому файлу'
            ], 403);
        }

        // Проверяем, что файл активен
        if (!$file->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Файл недоступен для скачивания'
            ], 404);
        }

        // Проверяем существование файла
        if (!$file->fileExists()) {
            return response()->json([
                'success' => false,
                'message' => 'Файл не найден на сервере'
            ], 404);
        }

        // Увеличиваем счетчик скачиваний
        $this->fileService->incrementDownloadCount($file);

        // Возвращаем файл для скачивания
        return Storage::disk('public')->download(
            $file->file_path,
            $file->original_name,
            [
                'Content-Type' => $file->mime_type,
            ]
        );
    }

    /**
     * Получить информацию о файле
     */
    public function show(Request $request, SpecialistFile $file): JsonResponse
    {
        $user = $request->user();

        try {
            $data = $this->fileService->getFileInfo($file, $user);

            if (!$data) {
                return response()->json([
                    'success' => false,
                    'message' => 'У вас нет доступа к этому файлу'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении информации о файле: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить все файлы специалиста (для статистики)
     */
    public function getAllFiles(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $data = $this->fileService->getAllFiles($user);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении файлов: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получить статистику файлов специалиста
     */
    public function getStats(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $data = $this->fileService->getFilesStats($user);

            return response()->json([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении статистики: ' . $e->getMessage()
            ], 500);
        }
    }
}