<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PageSeeder::class,
            IdentificationNumbersSeeder::class, // Сначала создаем ID номера
            UsersSeeder::class,                 // Затем базовых пользователей
            SpecialistContentSeeder::class,     // Потом контент (если есть специалисты)
        ]);
    }
}