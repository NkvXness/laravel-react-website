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
        Schema::create('identification_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique(); // Уникальный ID номер
            $table->string('description')->nullable(); // Описание (должность, отдел и т.д.)
            $table->boolean('is_used')->default(false); // Использован ли номер
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Кто использовал
            $table->timestamp('used_at')->nullable(); // Когда был использован
            $table->boolean('is_active')->default(true); // Активен ли номер
            $table->timestamps();
            
            // Индексы
            $table->index('number');
            $table->index('is_used');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('identification_numbers');
    }
};