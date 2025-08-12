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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('hospital_name');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            
            // Система ролей
            $table->enum('role', ['admin', 'specialist', 'user'])->default('user');
            
            // Поля для специалистов
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
            
            // Индексы для производительности
            $table->index('role');
            $table->index('is_active');
            $table->index('hospital_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};