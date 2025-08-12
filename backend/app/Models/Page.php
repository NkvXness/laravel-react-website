<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Page extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'slug',
        'title',
        'content',
        'meta_title',
        'meta_description',
        'is_published',
        'is_home',
        'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_home' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Поля для многоязычности
    public $translatable = [
        'title',
        'content',
        'meta_title',
        'meta_description'
    ];

    // Поддерживаемые языки
    public static function getLocales()
    {
        return ['ru', 'be', 'en'];
    }

    // Получить главную страницу
    public static function getHomePage()
    {
        return static::where('is_home', true)->first();
    }

    // Получить опубликованные страницы
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    // Получить страницы для навигации (исключая главную)
    public function scopeForNavigation($query)
    {
        return $query->published()
                    ->where('is_home', false)
                    ->orderBy('sort_order');
    }
}