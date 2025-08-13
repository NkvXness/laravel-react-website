<?php

namespace App\Services;

use App\Models\User;
use App\Models\SpecialistFile;
use App\Models\SpecialistContent;
use App\Services\Contracts\SpecialistFileServiceInterface;
use App\Http\Resources\SpecialistFileResource;
use Illuminate\Support\Facades\App;

/**
 * Сервис для работы с файлами специалистов
 * Реализует бизнес-логику управления файлами
 */
class SpecialistFileService implements SpecialistFileServiceInterface
{
    /**
     * Получить файлы специалиста по типу контента
     */
    public function getFilesByContentType(User $user, string $contentType): array
    {
        // Валидация типа контента
        if (!in_array($contentType, SpecialistContent::getAllTypes())) {
            return [
                'success' => false,
                'message' => 'Недопустимый тип контента'
            ];
        }

        // Получаем контент специалиста
        $content = SpecialistContent::forUser($user->id)
            ->byType($contentType)
            ->active()
            ->with(['activeFiles'])
            ->first();

        if (!$content) {
            return [
                'content' => null,
                'files' => [],
                'stats' => [
                    'total_files' => 0,
                    'total_size' => 0,
                    'formatted_size' => '0 bytes'
                ]
            ];
        }

        // Формируем данные о файлах
        $files = $content->activeFiles->map(function ($file) {
            return $this->formatFileData($file);
        });

        return [
            'content' => [
                'id' => $content->id,
                'type' => $content->content_type,
                'type_name' => $content->type_name,
                'title' => $content->getTranslation('title', App::getLocale()),
                'description' => $content->getTranslation('description', App::getLocale()),
                'content' => $content->getTranslation('content', App::getLocale()),
            ],
            'files' => $files,
            'stats' => [
                'total_files' => $content->files_count,
                'total_size' => $content->total_file_size,
                'formatted_size' => $content->formatted_file_size
            ]
        ];
    }

    /**
     * Получить все файлы специалиста
     */
    public function getAllFiles(User $user): array
    {
        // Получаем все файлы пользователя через контент
        $contents = SpecialistContent::forUser($user->id)
            ->active()
            ->with(['activeFiles'])
            ->get();

        $allFiles = [];
        $totalSize = 0;
        $filesByType = [];

        foreach ($contents as $content) {
            $contentType = $content->content_type;
            
            if (!isset($filesByType[$contentType])) {
                $filesByType[$contentType] = [
                    'type_name' => $content->type_name,
                    'files' => [],
                    'count' => 0,
                    'size' => 0
                ];
            }

            foreach ($content->activeFiles as $file) {
                $fileData = $this->formatFileData($file, $contentType);

                $allFiles[] = $fileData;
                $filesByType[$contentType]['files'][] = $fileData;
                $filesByType[$contentType]['count']++;
                $filesByType[$contentType]['size'] += $file->file_size;
                $totalSize += $file->file_size;
            }
        }

        return [
            'all_files' => $allFiles,
            'by_type' => $filesByType,
            'stats' => [
                'total_files' => count($allFiles),
                'total_size' => $totalSize,
                'formatted_size' => $this->formatFileSize($totalSize),
                'types_count' => count($filesByType)
            ]
        ];
    }

    /**
     * Получить информацию о конкретном файле
     */
    public function getFileInfo(SpecialistFile $file, User $user): ?array
    {
        // Проверяем доступ
        if (!$this->canAccessFile($file, $user)) {
            return null;
        }

        return [
            'id' => $file->id,
            'display_name' => $file->getTranslation('display_name', App::getLocale()),
            'description' => $file->getTranslation('description', App::getLocale()),
            'original_name' => $file->original_name,
            'file_size' => $file->file_size,
            'formatted_size' => $file->formatted_size,
            'mime_type' => $file->mime_type,
            'extension' => $file->extension,
            'file_icon' => $file->file_icon,
            'download_count' => $file->download_count,
            'is_active' => $file->is_active,
            'created_at' => $file->created_at,
            'updated_at' => $file->updated_at,
            'content' => [
                'type' => $file->specialistContent->content_type,
                'type_name' => $file->specialistContent->type_name,
            ]
        ];
    }

    /**
     * Проверить доступ пользователя к файлу
     */
    public function canAccessFile(SpecialistFile $file, User $user): bool
    {
        return $file->specialistContent->belongsToUser($user);
    }

    /**
     * Увеличить счетчик скачиваний файла
     */
    public function incrementDownloadCount(SpecialistFile $file): bool
    {
        try {
            $file->increment('download_count');
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Получить статистику файлов пользователя
     */
    public function getFilesStats(User $user): array
    {
        $contents = SpecialistContent::forUser($user->id)->active()->withCount('files')->get();
        
        $totalFiles = $contents->sum('files_count');
        $totalSize = 0;
        $typeStats = [];

        foreach ($contents as $content) {
            $contentSize = $content->total_file_size;
            $totalSize += $contentSize;

            $typeStats[$content->content_type] = [
                'type_name' => $content->type_name,
                'files_count' => $content->files_count,
                'total_size' => $contentSize,
                'formatted_size' => $content->formatted_file_size,
            ];
        }

        return [
            'total_files' => $totalFiles,
            'total_size' => $totalSize,
            'formatted_size' => $this->formatFileSize($totalSize),
            'by_type' => $typeStats,
            'content_pages' => $contents->count(),
        ];
    }

    /**
     * Форматировать размер файла в читаемый вид
     */
    public function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        
        return $bytes . ' bytes';
    }

    /**
     * Форматировать данные файла для ответа
     */
    private function formatFileData($file, ?string $contentType = null): array
    {
        return [
            'id' => $file->id,
            'display_name' => $file->getTranslation('display_name', App::getLocale()),
            'description' => $file->getTranslation('description', App::getLocale()),
            'original_name' => $file->original_name,
            'file_size' => $file->file_size,
            'formatted_size' => $file->formatted_size,
            'mime_type' => $file->mime_type,
            'extension' => $file->extension,
            'file_icon' => $file->file_icon,
            'download_count' => $file->download_count,
            'download_url' => route('api.specialist.file.download', ['file' => $file->id]),
            'content_type' => $contentType ?? $file->specialistContent->content_type,
            'created_at' => $file->created_at,
        ];
    }
}