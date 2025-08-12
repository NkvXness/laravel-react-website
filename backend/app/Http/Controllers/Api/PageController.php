<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    /**
     * Получить все опубликованные страницы
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ru');
        
        $pages = Page::published()
                    ->orderBy('sort_order')
                    ->get()
                    ->map(function ($page) use ($locale) {
                        return [
                            'id' => $page->id,
                            'slug' => $page->slug,
                            'title' => $page->getTranslation('title', $locale),
                            'is_home' => $page->is_home,
                            'sort_order' => $page->sort_order,
                        ];
                    });

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }

    /**
     * Получить страницу по slug
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = $request->get('locale', 'ru');
        
        $page = Page::where('slug', $slug)
                   ->published()
                   ->first();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Страница не найдена'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $page->id,
                'slug' => $page->slug,
                'title' => $page->getTranslation('title', $locale),
                'content' => $page->getTranslation('content', $locale),
                'meta_title' => $page->getTranslation('meta_title', $locale),
                'meta_description' => $page->getTranslation('meta_description', $locale),
                'is_home' => $page->is_home,
            ]
        ]);
    }

    /**
     * Получить главную страницу
     */
    public function home(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ru');
        
        $page = Page::getHomePage();

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Главная страница не найдена'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $page->id,
                'slug' => $page->slug,
                'title' => $page->getTranslation('title', $locale),
                'content' => $page->getTranslation('content', $locale),
                'meta_title' => $page->getTranslation('meta_title', $locale),
                'meta_description' => $page->getTranslation('meta_description', $locale),
                'is_home' => $page->is_home,
            ]
        ]);
    }

    /**
     * Получить страницы для навигации
     */
    public function navigation(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ru');
        
        $pages = Page::forNavigation()
                    ->get()
                    ->map(function ($page) use ($locale) {
                        return [
                            'slug' => $page->slug,
                            'title' => $page->getTranslation('title', $locale),
                            'sort_order' => $page->sort_order,
                        ];
                    });

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }
}