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
        Schema::create('specialist_content', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Тип контента (documents, instructions)
            $table->enum('content_type', ['documents', 'instructions']);
            
            // Многоязычный контент
            $table->json('title');         // Заголовок страницы
            $table->json('description');   // Описание страницы
            $table->json('content');       // Основной контент
            
            // Метаданные
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            
            $table->timestamps();
            
            // Индексы
            $table->index(['user_id', 'content_type']);
            $table->index('is_active');
            $table->index('sort_order');
            
            // Ограничение: один тип контента на специалиста
            $table->unique(['user_id', 'content_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialist_content');
    }
};