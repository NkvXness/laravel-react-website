<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class SpecialistFile extends Model
{
    use HasFactory, HasTranslations;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'specialist_content_id',
        'original_name',
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
        'display_name',
        'description',
        'is_active',
        'sort_order',
        'download_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'download_count' => 'integer',
    ];

    /**
     * Поля для многоязычности
     */
    public $translatable = [
        'display_name',
        'description'
    ];

    /**
     * Поддерживаемые языки
     */
    public static function getLocales(): array
    {
        return ['ru', 'be', 'en'];
    }

    /**
     * Связь с контентом специалиста
     */
    public function specialistContent(): BelongsTo
    {
        return $this->belongsTo(SpecialistContent::class);
    }

    /**
     * Получить URL файла для скачивания
     */
    public function getDownloadUrlAttribute(): string
    {
        return route('api.specialist.file.download', ['file' => $this->id]);
    }

    /**
     * Получить полный путь к файлу
     */
    public function getFullPathAttribute(): string
    {
        return Storage::disk('public')->path($this->file_path);
    }

    /**
     * Проверить существование файла
     */
    public function fileExists(): bool
    {
        return Storage::disk('public')->exists($this->file_path);
    }

    /**
     * Форматированный размер файла
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        
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
     * Получить расширение файла
     */
    public function getExtensionAttribute(): string
    {
        return pathinfo($this->original_name, PATHINFO_EXTENSION);
    }

    /**
     * Проверить, является ли файл изображением
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Проверить, является ли файл документом
     */
    public function isDocument(): bool
    {
        $documentMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
        ];

        return in_array($this->mime_type, $documentMimes);
    }

    /**
     * Получить иконку файла в зависимости от типа
     */
    public function getFileIconAttribute(): string
    {
        if ($this->isImage()) {
            return 'image';
        }

        return match ($this->mime_type) {
            'application/pdf' => 'file-text',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'file-text',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'file-spreadsheet',
            'text/plain' => 'file-text',
            'application/zip',
            'application/x-rar-compressed' => 'archive',
            default => 'file'
        };
    }

    /**
     * Скоупы для фильтрации
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopeByContentType($query, string $contentType)
    {
        return $query->whereHas('specialistContent', function ($q) use ($contentType) {
            $q->where('content_type', $contentType);
        });
    }

    /**
     * Увеличить счетчик скачиваний
     */
    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
    }

    /**
     * Удалить файл из хранилища
     */
    public function deleteFile(): bool
    {
        if ($this->fileExists()) {
            return Storage::disk('public')->delete($this->file_path);
        }
        return true;
    }

    /**
     * Boot метод для установки значений по умолчанию
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (is_null($model->sort_order)) {
                $model->sort_order = static::where('specialist_content_id', $model->specialist_content_id)
                                          ->max('sort_order') + 1;
            }
        });

        static::deleting(function ($model) {
            $model->deleteFile();
        });
    }
}