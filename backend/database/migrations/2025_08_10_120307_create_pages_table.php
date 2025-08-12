<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title'); // Многоязычный заголовок
            $table->json('content'); // Многоязычный контент
            $table->json('meta_title')->nullable(); // SEO заголовок
            $table->json('meta_description')->nullable(); // SEO описание
            $table->boolean('is_published')->default(true);
            $table->boolean('is_home')->default(false); // Главная страница
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};