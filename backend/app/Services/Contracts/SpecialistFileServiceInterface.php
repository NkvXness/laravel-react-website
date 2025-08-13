<?php

namespace App\Services\Contracts;

use App\Models\User;
use App\Models\SpecialistFile;

/**
 * Интерфейс сервиса для работы с файлами специалистов
 * Определяет контракт для бизнес-логики управления файлами
 */
interface SpecialistFileServiceInterface
{
    /**
     * Получить файлы специалиста по типу контента
     *
     * @param User $user Пользователь-специалист
     * @param string $contentType Тип контента (legislation, information)
     * @return array Данные файлов с контентом и статистикой
     */
    public function getFilesByContentType(User $user, string $contentType): array;

    /**
     * Получить все файлы специалиста
     *
     * @param User $user Пользователь-специалист
     * @return array Все файлы сгруппированные по типам с общей статистикой
     */
    public function getAllFiles(User $user): array;

    /**
     * Получить информацию о конкретном файле
     *
     * @param SpecialistFile $file Файл
     * @param User $user Пользователь для проверки доступа
     * @return array|null Информация о файле или null если нет доступа
     */
    public function getFileInfo(SpecialistFile $file, User $user): ?array;

    /**
     * Проверить доступ пользователя к файлу
     *
     * @param SpecialistFile $file Файл
     * @param User $user Пользователь
     * @return bool Есть ли доступ
     */
    public function canAccessFile(SpecialistFile $file, User $user): bool;

    /**
     * Увеличить счетчик скачиваний файла
     *
     * @param SpecialistFile $file Файл
     * @return bool Успешность операции
     */
    public function incrementDownloadCount(SpecialistFile $file): bool;

    /**
     * Получить статистику файлов пользователя
     *
     * @param User $user Пользователь-специалист
     * @return array Статистика по файлам
     */
    public function getFilesStats(User $user): array;

    /**
     * Форматировать размер файла в читаемый вид
     *
     * @param int $bytes Размер в байтах
     * @return string Форматированный размер
     */
    public function formatFileSize(int $bytes): string;
}