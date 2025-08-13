<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;

/**
 * Ресурс для трансформации данных файлов специалиста
 * Обеспечивает единообразное форматирование файлов в API ответах
 */
class SpecialistFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = App::getLocale();
        
        return [
            'id' => $this->id,
            'display_name' => $this->getTranslation('display_name', $locale),
            'description' => $this->getTranslation('description', $locale),
            'original_name' => $this->original_name,
            'file_name' => $this->file_name,
            'file_size' => $this->file_size,
            'formatted_size' => $this->formatted_size,
            'mime_type' => $this->mime_type,
            'extension' => $this->extension,
            'file_icon' => $this->file_icon,
            'download_count' => $this->download_count,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            
            // URLs для работы с файлом
            'download_url' => route('api.specialist.file.download', ['file' => $this->id]),
            
            // Информация о контенте (если загружен)
            'content' => $this->when(
                $this->relationLoaded('specialistContent'),
                fn() => [
                    'id' => $this->specialistContent->id,
                    'type' => $this->specialistContent->content_type,
                    'type_name' => $this->specialistContent->type_name,
                ]
            ),
            
            // Метаданные файла
            'metadata' => [
                'is_image' => $this->isImage(),
                'is_document' => $this->isDocument(),
                'file_exists' => $this->fileExists(),
            ],
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Получить дополнительные данные для включения в ответ
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'supported_mime_types' => $this->getSupportedMimeTypes(),
                'max_file_size' => config('filesystems.max_file_size', '10MB'),
                'current_locale' => App::getLocale(),
            ]
        ];
    }

    /**
     * Получить список поддерживаемых MIME типов
     */
    private function getSupportedMimeTypes(): array
    {
        return [
            'documents' => [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
            ],
            'images' => [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/svg+xml',
            ],
            'archives' => [
                'application/zip',
                'application/x-rar-compressed',
            ],
        ];
    }
}