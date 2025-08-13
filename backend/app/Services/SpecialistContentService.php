<?php

namespace App\Services;

use App\Models\User;
use App\Models\SpecialistContent;
use App\Services\Contracts\SpecialistContentServiceInterface;
use App\Http\Resources\SpecialistContentResource;
use Illuminate\Support\Facades\App;

/**
 * Сервис для работы с контентом специалистов
 * Реализует бизнес-логику управления контентом
 */
class SpecialistContentService implements SpecialistContentServiceInterface
{
    /**
     * Получить контент специалиста по типу
     */
    public function getContentByType(User $user, string $type): ?array
    {
        // Валидация типа контента
        if (!in_array($type, SpecialistContent::getAllTypes())) {
            return null;
        }

        $content = SpecialistContent::forUser($user->id)
            ->byType($type)
            ->active()
            ->with(['activeFiles'])
            ->first();

        if (!$content) {
            return [
                'content' => null,
                'files' => [],
                'message' => 'Контент пока не создан',
                'stats' => [
                    'total_files' => 0,
                    'total_size' => 0,
                    'formatted_size' => '0 bytes'
                ]
            ];
        }

        return [
            'content' => new SpecialistContentResource($content),
            'files' => $content->activeFiles->map(function ($file) {
                return $this->formatFileData($file);
            }),
            'stats' => [
                'total_files' => $content->files_count,
                'total_size' => $content->total_file_size,
                'formatted_size' => $content->formatted_file_size
            ]
        ];
    }

    /**
     * Получить весь контент специалиста
     */
    public function getAllContent(User $user): array
    {
        $contents = SpecialistContent::forUser($user->id)
            ->active()
            ->with(['activeFiles'])
            ->orderBy('sort_order')
            ->get();

        $formattedContents = [];
        $totalFiles = 0;
        $totalSize = 0;

        foreach ($contents as $content) {
            $files = $content->activeFiles->map(function ($file) {
                return $this->formatFileData($file);
            });

            $totalFiles += $files->count();
            $totalSize += $content->total_file_size;

            $formattedContents[] = [
                'id' => $content->id,
                'type' => $content->content_type,
                'type_name' => $content->type_name,
                'title' => $content->getTranslation('title', App::getLocale()),
                'description' => $content->getTranslation('description', App::getLocale()),
                'content' => $content->getTranslation('content', App::getLocale()),
                'files' => $files,
                'files_count' => $files->count(),
                'total_size' => $content->total_file_size,
                'formatted_size' => $content->formatted_file_size,
                'created_at' => $content->created_at,
                'updated_at' => $content->updated_at,
            ];
        }

        return [
            'contents' => $formattedContents,
            'stats' => [
                'total_content_pages' => $contents->count(),
                'total_files' => $totalFiles,
                'total_size' => $totalSize,
                'formatted_size' => $this->formatFileSize($totalSize),
            ]
        ];
    }

    /**
     * Получить статистику контента специалиста
     */
    public function getContentStats(User $user): array
    {
        $contentCount = SpecialistContent::forUser($user->id)->active()->count();
        
        $totalFiles = $user->specialistContent()
            ->withCount('files')
            ->get()
            ->sum('files_count');

        return [
            'content_pages' => $contentCount,
            'total_files' => $totalFiles,
        ];
    }

    /**
     * Проверить существование контента определенного типа
     */
    public function hasContentOfType(User $user, string $type): bool
    {
        if (!in_array($type, SpecialistContent::getAllTypes())) {
            return false;
        }

        return SpecialistContent::forUser($user->id)
            ->byType($type)
            ->active()
            ->exists();
    }

    /**
     * Форматировать данные файла для ответа
     */
    private function formatFileData($file): array
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
            'created_at' => $file->created_at,
        ];
    }

    /**
     * Форматировать размер файла в читаемый вид
     */
    private function formatFileSize(int $bytes): string
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
}