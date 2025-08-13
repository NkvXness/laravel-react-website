<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Обновляем enum типы контента
        DB::statement("ALTER TABLE specialist_content MODIFY COLUMN content_type ENUM('legislation', 'information') NOT NULL");
        
        // Обновляем существующие записи
        DB::table('specialist_content')
            ->where('content_type', 'documents')
            ->update(['content_type' => 'legislation']);
            
        DB::table('specialist_content')
            ->where('content_type', 'instructions')
            ->update(['content_type' => 'information']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Возвращаем старые типы
        DB::table('specialist_content')
            ->where('content_type', 'legislation')
            ->update(['content_type' => 'documents']);
            
        DB::table('specialist_content')
            ->where('content_type', 'information')
            ->update(['content_type' => 'instructions']);
            
        // Возвращаем старый enum
        DB::statement("ALTER TABLE specialist_content MODIFY COLUMN content_type ENUM('documents', 'instructions') NOT NULL");
    }
};