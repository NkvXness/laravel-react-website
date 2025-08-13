<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Contracts\SpecialistContentServiceInterface;
use App\Services\Contracts\SpecialistFileServiceInterface;
use App\Services\SpecialistContentService;
use App\Services\SpecialistFileService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Регистрация сервисов для работы с контентом специалистов
        $this->app->bind(
            SpecialistContentServiceInterface::class,
            SpecialistContentService::class
        );

        $this->app->bind(
            SpecialistFileServiceInterface::class,
            SpecialistFileService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}