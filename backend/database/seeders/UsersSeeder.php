<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создание администратора
        User::firstOrCreate(
            ['email' => 'adminsensei@mail.com'],
            [
                'first_name' => 'Админ',
                'last_name' => 'УГОНД',
                'email' => 'adminsensei@mail.com',
                'hospital_name' => 'УГОНД',
                'password' => Hash::make('alonedjdodemoiSauke17'),
                'role' => User::ROLE_ADMIN,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Созданы базовые пользователи:');
        $this->command->info('Админ: adminsensei@mail.com / alonedjdodemoiSauke17');
        $this->command->info('');
        $this->command->info('Специалисты должны регистрироваться самостоятельно по ID номерам.');
        $this->command->info('Доступные ID номера для тестирования можно посмотреть в таблице identification_numbers.');
    }
}