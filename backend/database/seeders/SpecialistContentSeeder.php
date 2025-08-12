<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SpecialistContent;

class SpecialistContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Получаем всех специалистов
        $specialists = User::where('role', User::ROLE_SPECIALIST)->get();

        if ($specialists->isEmpty()) {
            $this->command->info('Нет зарегистрированных специалистов. Контент не создан.');
            $this->command->info('Специалисты должны сначала зарегистрироваться по ID номерам.');
            return;
        }

        foreach ($specialists as $specialist) {
            // Создаем контент "Документы" для каждого специалиста
            SpecialistContent::firstOrCreate(
                [
                    'user_id' => $specialist->id,
                    'content_type' => SpecialistContent::TYPE_DOCUMENTS
                ],
                [
                    'title' => [
                        'ru' => 'Документы для ' . $specialist->full_name,
                        'be' => 'Дакументы для ' . $specialist->full_name,
                        'en' => 'Documents for ' . $specialist->full_name
                    ],
                    'description' => [
                        'ru' => 'Персональные документы и материалы для специалиста',
                        'be' => 'Персанальныя дакументы і матэрыялы для спецыяліста',
                        'en' => 'Personal documents and materials for specialist'
                    ],
                    'content' => [
                        'ru' => '<h2>Документы для скачивания</h2>
                                 <p>Здесь размещены ваши персональные документы и материалы.</p>
                                 <p>Для скачивания документов нажмите на соответствующую ссылку.</p>',
                        'be' => '<h2>Дакументы для спампоўкі</h2>
                                 <p>Тут размешчаны вашы персанальныя дакументы і матэрыялы.</p>
                                 <p>Для спампоўкі дакументаў націсніце на адпаведную спасылку.</p>',
                        'en' => '<h2>Documents for Download</h2>
                                 <p>Here are your personal documents and materials.</p>
                                 <p>Click on the corresponding link to download documents.</p>'
                    ],
                    'is_active' => true,
                    'sort_order' => 1,
                ]
            );

            // Создаем контент "Инструкции" для каждого специалиста  
            SpecialistContent::firstOrCreate(
                [
                    'user_id' => $specialist->id,
                    'content_type' => SpecialistContent::TYPE_INSTRUCTIONS
                ],
                [
                    'title' => [
                        'ru' => 'Инструкции для ' . $specialist->full_name,
                        'be' => 'Інструкцыі для ' . $specialist->full_name,
                        'en' => 'Instructions for ' . $specialist->full_name
                    ],
                    'description' => [
                        'ru' => 'Рабочие инструкции и методические указания',
                        'be' => 'Працоўныя інструкцыі і метадычныя ўказанні',
                        'en' => 'Work instructions and methodological guidelines'
                    ],
                    'content' => [
                        'ru' => '<h2>Инструкции и методические материалы</h2>
                                 <p>В данном разделе представлены инструкции по работе и методические материалы.</p>
                                 <p>Регулярно проверяйте обновления документов.</p>',
                        'be' => '<h2>Інструкцыі і метадычныя матэрыялы</h2>
                                 <p>У дадзеным раздзеле прадстаўлены інструкцыі па працы і метадычныя матэрыялы.</p>
                                 <p>Рэгулярна правярайце абнаўленні дакументаў.</p>',
                        'en' => '<h2>Instructions and Methodological Materials</h2>
                                 <p>This section presents work instructions and methodological materials.</p>
                                 <p>Regularly check for document updates.</p>'
                    ],
                    'is_active' => true,
                    'sort_order' => 2,
                ]
            );
        }

        $this->command->info('Создан персональный контент для ' . $specialists->count() . ' специалистов');
        $this->command->info('Каждый специалист получил 2 персональные страницы: Документы и Инструкции');
    }
}