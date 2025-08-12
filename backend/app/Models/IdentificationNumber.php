<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IdentificationNumber extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'number',
        'description',
        'is_used',
        'user_id',
        'used_at',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_used' => 'boolean',
        'is_active' => 'boolean',
        'used_at' => 'datetime',
    ];

    /**
     * Связь с пользователем, который использовал этот номер
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Проверить, доступен ли номер для регистрации
     */
    public function isAvailableForRegistration(): bool
    {
        return $this->is_active && !$this->is_used;
    }

    /**
     * Пометить номер как использованный
     */
    public function markAsUsed(User $user): void
    {
        $this->update([
            'is_used' => true,
            'user_id' => $user->id,
            'used_at' => now(),
        ]);
    }

    /**
     * Освободить номер (сделать доступным снова)
     */
    public function release(): void
    {
        $this->update([
            'is_used' => false,
            'user_id' => null,
            'used_at' => null,
        ]);
    }

    /**
     * Скоупы для фильтрации
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)->where('is_used', false);
    }

    public function scopeUsed($query)
    {
        return $query->where('is_used', true);
    }

    /**
     * Найти доступный номер
     */
    public static function findAvailable(string $number): ?self
    {
        return static::where('number', $number)->available()->first();
    }

    /**
     * Проверить существование и доступность номера
     */
    public static function isNumberAvailable(string $number): bool
    {
        $idNumber = static::where('number', $number)->first();
        
        if (!$idNumber) {
            return false;
        }
        
        return $idNumber->isAvailableForRegistration();
    }

    /**
     * Получить статистику по номерам
     */
    public static function getStats(): array
    {
        return [
            'total' => static::count(),
            'active' => static::active()->count(),
            'available' => static::available()->count(),
            'used' => static::used()->count(),
        ];
    }

    /**
     * Создать набор номеров с префиксом
     */
    public static function createBatch(string $prefix, int $start, int $end, ?string $description = null): int
    {
        $created = 0;
        
        for ($i = $start; $i <= $end; $i++) {
            $number = $prefix . str_pad($i, 3, '0', STR_PAD_LEFT);
            
            // Проверяем, не существует ли уже такой номер
            if (!static::where('number', $number)->exists()) {
                static::create([
                    'number' => $number,
                    'description' => $description,
                    'is_active' => true,
                ]);
                $created++;
            }
        }
        
        return $created;
    }
}