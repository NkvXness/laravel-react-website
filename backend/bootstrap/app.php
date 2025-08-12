<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',  // Регистрация API маршрутов
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api', // Префикс для API маршрутов (/api/v1/...)
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Настройка CORS middleware для API
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Регистрация middleware для ролей
        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'specialist' => \App\Http\Middleware\SpecialistMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Обработка исключений
    })->create();