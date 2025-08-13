<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;

/**
 * Ресурс для трансформации данных контента специалиста
 * Обеспечивает единообразное форматирование ответов API
 */
class SpecialistContentResource extends JsonResource
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
            'type' => $this->content_type,
            'type_name' => $this->type_name,
            'title' => $this->getTranslation('title', $locale),
            'description' => $this->getTranslation('description', $locale),
            'content' => $this->getTranslation('content', $locale),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'files_count' => $this->when(
                $this->relationLoaded('files'),
                fn() => $this->files->count()
            ),
            'active_files_count' => $this->when(
                $this->relationLoaded('activeFiles'),
                fn() => $this->activeFiles->count()
            ),
            'total_file_size' => $this->when(
                $this->relationLoaded('files') || $this->relationLoaded('activeFiles'),
                fn() => $this->total_file_size
            ),
            'formatted_file_size' => $this->when(
                $this->relationLoaded('files') || $this->relationLoaded('activeFiles'),
                fn() => $this->formatted_file_size
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Включаем файлы только если они загружены
            'files' => SpecialistFileResource::collection(
                $this->whenLoaded('activeFiles')
            ),
        ];
    }

    /**
     * Получить дополнительные данные для включения в ответ
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'available_types' => \App\Models\SpecialistContent::getAllTypes(),
                'type_translations' => \App\Models\SpecialistContent::getTypeTranslations(),
                'current_locale' => App::getLocale(),
            ]
        ];
    }
}