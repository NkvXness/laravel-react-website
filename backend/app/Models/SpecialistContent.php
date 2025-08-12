<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class SpecialistContent extends Model
{
    use HasFactory, HasTranslations;

    /**
     * ИСПРАВЛЕНО: Указываем правильное имя таблицы
     */
    protected $table = 'specialist_content';

    /**
     * Типы контента
     */
    const TYPE_DOCUMENTS = 'documents';
    const TYPE_INSTRUCTIONS = 'instructions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'content_type',
        'title',
        'description',
        'content',
        'is_active',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Поля для многоязычности
     */
    public $translatable = [
        'title',
        'description',
        'content'
    ];

    /**
     * Поддерживаемые языки
     */
    public static function getLocales(): array
    {
        return ['ru', 'be', 'en'];
    }

    /**
     * Связь с пользователем (специалистом)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Связь с файлами контента
     */
    public function files(): HasMany
    {
        return $this->hasMany(SpecialistFile::class);
    }

    /**
     * Получить активные файлы
     */
    public function activeFiles(): HasMany
    {
        return $this->files()->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * Получить все возможные типы контента
     */
    public static function getAllTypes(): array
    {
        return [
            self::TYPE_DOCUMENTS,
            self::TYPE_INSTRUCTIONS,
        ];
    }

    /**
     * Получить переводы типов контента
     */
    public static function getTypeTranslations(): array
    {
        return [
            self::TYPE_DOCUMENTS => [
                'ru' => 'Документы',
                'be' => 'Дакументы', 
                'en' => 'Documents'
            ],
            self::TYPE_INSTRUCTIONS => [
                'ru' => 'Инструкции',
                'be' => 'Інструкцыі',
                'en' => 'Instructions'
            ],
        ];
    }

    /**
     * Получить название типа на определенном языке
     */
    public function getTypeNameAttribute(): string
    {
        $translations = self::getTypeTranslations();
        $locale = app()->getLocale();
        
        return $translations[$this->content_type][$locale] ?? $this->content_type;
    }

    /**
     * Скоупы для фильтрации
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('content_type', $type);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Проверка принадлежности контента пользователю
     */
    public function belongsToUser(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    /**
     * Получить количество файлов
     */
    public function getFilesCountAttribute(): int
    {
        return $this->files()->count();
    }

    /**
     * Получить общий размер файлов в байтах
     */
    public function getTotalFileSizeAttribute(): int
    {
        return $this->files()->sum('file_size');
    }

    /**
     * Форматированный размер файлов
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->total_file_size;
        
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
     * Boot метод для установки значений по умолчанию
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (is_null($model->sort_order)) {
                $model->sort_order = static::where('user_id', $model->user_id)->max('sort_order') + 1;
            }
        });
    }
}