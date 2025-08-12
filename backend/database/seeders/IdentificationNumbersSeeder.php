<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\IdentificationNumber;

class IdentificationNumbersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаем ID номера для разных отделов

        // Номера для наркологического отдела
        $narcologyNumbers = [
            ['number' => 'NARC001', 'description' => 'Главный нарколог'],
            ['number' => 'NARC002', 'description' => 'Врач-нарколог (старший)'],
            ['number' => 'NARC003', 'description' => 'Врач-нарколог'],
            ['number' => 'NARC004', 'description' => 'Врач-нарколог'],
            ['number' => 'NARC005', 'description' => 'Врач-нарколог'],
        ];

        // Номера для психотерапевтического отдела
        $psychoNumbers = [
            ['number' => 'PSYC001', 'description' => 'Главный психотерапевт'],
            ['number' => 'PSYC002', 'description' => 'Психотерапевт (старший)'],
            ['number' => 'PSYC003', 'description' => 'Психотерапевт'],
            ['number' => 'PSYC004', 'description' => 'Психолог'],
            ['number' => 'PSYC005', 'description' => 'Психолог'],
        ];

        // Номера для административного персонала
        $adminNumbers = [
            ['number' => 'ADMIN001', 'description' => 'Заместитель главного врача'],
            ['number' => 'ADMIN002', 'description' => 'Заведующий отделением'],
            ['number' => 'ADMIN003', 'description' => 'Администратор'],
        ];

        // Объединяем все номера
        $allNumbers = array_merge($narcologyNumbers, $psychoNumbers, $adminNumbers);

        // Создаем записи в базе данных
        foreach ($allNumbers as $numberData) {
            IdentificationNumber::firstOrCreate(
                ['number' => $numberData['number']],
                [
                    'description' => $numberData['description'],
                    'is_active' => true,
                    'is_used' => false,
                ]
            );
        }

        // Создаем дополнительные номера с помощью batch метода
        IdentificationNumber::createBatch('SPEC', 1, 10, 'Специалист (резерв)');
        IdentificationNumber::createBatch('TEMP', 1, 5, 'Временный сотрудник');

        $this->command->info('Создано ' . IdentificationNumber::count() . ' идентификационных номеров');
        
        // Показываем статистику
        $stats = IdentificationNumber::getStats();
        $this->command->info("Статистика номеров:");
        $this->command->info("- Всего: {$stats['total']}");
        $this->command->info("- Активных: {$stats['active']}");
        $this->command->info("- Доступных: {$stats['available']}");
        $this->command->info("- Использованных: {$stats['used']}");
    }
}