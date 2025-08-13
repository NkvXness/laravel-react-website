<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Роли пользователей
     */
    const ROLE_ADMIN = 'admin';
    const ROLE_SPECIALIST = 'specialist';
    const ROLE_USER = 'user';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'hospital_name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * Accessor для полного имени
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * ДОБАВЛЕНО: Accessor для полного представления специалиста
     */
    public function getFullSpecialistInfoAttribute(): string
    {
        $fullName = $this->getFullNameAttribute();
        
        if ($this->isSpecialist() && $this->hospital_name) {
            return "{$fullName} ({$this->hospital_name})";
        }
        
        return $fullName;
    }

    /**
     * Проверка роли администратора
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Проверка роли специалиста
     */
    public function isSpecialist(): bool
    {
        return $this->role === self::ROLE_SPECIALIST;
    }

    /**
     * Проверка роли обычного пользователя
     */
    public function isUser(): bool
    {
        return $this->role === self::ROLE_USER;
    }

    /**
     * Проверка активности пользователя
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Получить все возможные роли
     */
    public static function getAllRoles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_SPECIALIST,
            self::ROLE_USER,
        ];
    }

    /**
     * Скоупы для фильтрации по ролям
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeSpecialists($query)
    {
        return $query->where('role', self::ROLE_SPECIALIST);
    }

    public function scopeUsers($query)
    {
        return $query->where('role', self::ROLE_USER);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * ДОБАВЛЕНО: Скоуп для фильтрации по ЦРБ
     */
    public function scopeByHospital($query, $hospitalName)
    {
        return $query->where('hospital_name', $hospitalName);
    }

    /**
     * Связь с идентификационным номером (для специалистов)
     */
    public function identificationNumber(): HasOne
    {
        return $this->hasOne(IdentificationNumber::class);
    }

    /**
     * Связь с персональным контентом (для специалистов)
     */
    public function specialistContent(): HasMany
    {
        return $this->hasMany(SpecialistContent::class);
    }

    /**
     * Получить персональный контент по типу
     */
    public function getContentByType(string $type): ?SpecialistContent
    {
        return $this->specialistContent()
                   ->where('content_type', $type)
                   ->where('is_active', true)
                   ->first();
    }

    /**
     * Обновление времени последнего входа
     */
    public function updateLastLoginTime(): void
    {
        $this->update(['last_login_at' => now()]);
    }

    /**
     * Проверка возможности доступа к админ-панели
     */
    public function canAccessAdmin(): bool
    {
        return $this->isAdmin() && $this->isActive();
    }

    /**
     * Проверка возможности доступа к личному кабинету
     */
    public function canAccessProfile(): bool
    {
        return ($this->isSpecialist() || $this->isAdmin()) && $this->isActive();
    }

    /**
     * Получить список уникальных ЦРБ
     */
    public static function getUniqueHospitals(): array
    {
        return self::specialists()
            ->whereNotNull('hospital_name')
            ->distinct()
            ->pluck('hospital_name')
            ->toArray();
    }
}