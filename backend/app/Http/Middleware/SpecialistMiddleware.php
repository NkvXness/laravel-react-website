<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SpecialistMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Проверяем аутентификацию
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Требуется аутентификация'
            ], 401);
        }

        // Проверяем права специалиста или админа
        if (!$request->user()->canAccessProfile()) {
            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещен. Требуются права специалиста или администратора'
            ], 403);
        }

        return $next($request);
    }
}