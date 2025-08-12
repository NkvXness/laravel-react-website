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
        Schema::create('specialist_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialist_content_id')->constrained('specialist_content')->onDelete('cascade');
            
            // Информация о файле
            $table->string('original_name');     // Оригинальное имя файла
            $table->string('file_name');         // Имя файла в хранилище
            $table->string('file_path');         // Путь к файлу
            $table->string('mime_type');         // MIME тип файла
            $table->bigInteger('file_size');     // Размер файла в байтах
            
            // Многоязычные данные
            $table->json('display_name');        // Отображаемое имя для пользователей
            $table->json('description')->nullable(); // Описание файла
            
            // Метаданные
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->integer('download_count')->default(0);
            
            $table->timestamps();
            
            // Индексы
            $table->index('specialist_content_id');
            $table->index('is_active');
            $table->index('sort_order');
            $table->index('download_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialist_files');
    }
};