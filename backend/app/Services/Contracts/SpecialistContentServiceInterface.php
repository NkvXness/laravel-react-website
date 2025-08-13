<?php

namespace App\Services\Contracts;

use App\Models\User;

/**
 * Интерфейс сервиса для работы с контентом специалистов
 * Определяет контракт для бизнес-логики управления контентом
 */
interface SpecialistContentServiceInterface
{
    /**
     * Получить контент специалиста по типу
     *
     * @param User $user Пользователь-специалист
     * @param string $type Тип контента (legislation, information)
     * @return array|null Данные контента или null если не найден
     */
    public function getContentByType(User $user, string $type): ?array;

    /**
     * Получить весь контент специалиста
     *
     * @param User $user Пользователь-специалист
     * @return array Массив со всем контентом и статистикой
     */
    public function getAllContent(User $user): array;

    /**
     * Получить статистику контента специалиста
     *
     * @param User $user Пользователь-специалист
     * @return array Статистика по контенту
     */
    public function getContentStats(User $user): array;

    /**
     * Проверить существование контента определенного типа
     *
     * @param User $user Пользователь-специалист
     * @param string $type Тип контента
     * @return bool Существует ли контент
     */
    public function hasContentOfType(User $user, string $type): bool;
}