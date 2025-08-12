<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создание главной страницы
        Page::create([
            'slug' => 'home',
            'title' => [
                'ru' => 'Главная страница',
                'be' => 'Галоўная старонка',
                'en' => 'Home Page'
            ],
            'content' => [
                'ru' => '<h1>Добро пожаловать в наше медицинское учреждение</h1>
                         <p>Мы предоставляем профессиональные услуги наркологической помощи.</p>
                         <p>Наша команда специалистов готова помочь вам в решении проблем зависимости.</p>',
                'be' => '<h1>Сардэчна запрашаем у нашу медыцынскую ўстанову</h1>
                         <p>Мы прадастаўляем прафесійныя паслугі наркалагічнай дапамогі.</p>
                         <p>Наша каманда спецыялістаў гатова дапамагчы вам у рашэнні праблем залежнасці.</p>',
                'en' => '<h1>Welcome to our medical institution</h1>
                         <p>We provide professional narcological assistance services.</p>
                         <p>Our team of specialists is ready to help you solve addiction problems.</p>'
            ],
            'meta_title' => [
                'ru' => 'Наркологическое медицинское учреждение',
                'be' => 'Наркалагічная медыцынская ўстанова',
                'en' => 'Narcological Medical Institution'
            ],
            'meta_description' => [
                'ru' => 'Профессиональная наркологическая помощь, лечение зависимости, квалифицированные специалисты',
                'be' => 'Прафесійная наркалагічная дапамога, лячэнне залежнасці, кваліфікаваныя спецыялісты',
                'en' => 'Professional narcological assistance, addiction treatment, qualified specialists'
            ],
            'is_published' => true,
            'is_home' => true,
            'sort_order' => 0,
        ]);

        // Создание примерных страниц для навигации
        Page::create([
            'slug' => 'about',
            'title' => [
                'ru' => 'О нас',
                'be' => 'Пра нас',
                'en' => 'About Us'
            ],
            'content' => [
                'ru' => '<h1>О нашем медицинском учреждении</h1>
                         <p>Информация об учреждении будет добавлена через CMS.</p>',
                'be' => '<h1>Пра нашу медыцынскую ўстанову</h1>
                         <p>Інфармацыя аб установе будзе дададзена праз CMS.</p>',
                'en' => '<h1>About our medical institution</h1>
                         <p>Information about the institution will be added via CMS.</p>'
            ],
            'meta_title' => [
                'ru' => 'О нас - Наркологическое медицинское учреждение',
                'be' => 'Пра нас - Наркалагічная медыцынская ўстанова',
                'en' => 'About Us - Narcological Medical Institution'
            ],
            'is_published' => true,
            'is_home' => false,
            'sort_order' => 1,
        ]);

        Page::create([
            'slug' => 'contacts',
            'title' => [
                'ru' => 'Контакты',
                'be' => 'Кантакты',
                'en' => 'Contacts'
            ],
            'content' => [
                'ru' => '<h1>Контактная информация</h1>
                         <p>Контактные данные будут добавлены через CMS.</p>',
                'be' => '<h1>Кантактная інфармацыя</h1>
                         <p>Кантактныя дадзеныя будуць дададзены праз CMS.</p>',
                'en' => '<h1>Contact Information</h1>
                         <p>Contact details will be added via CMS.</p>'
            ],
            'meta_title' => [
                'ru' => 'Контакты - Наркологическое медицинское учреждение',
                'be' => 'Кантакты - Наркалагічная медыцынская ўстанова',
                'en' => 'Contacts - Narcological Medical Institution'
            ],
            'is_published' => true,
            'is_home' => false,
            'sort_order' => 2,
        ]);
    }
}