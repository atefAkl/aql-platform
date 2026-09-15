<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Atomic Permissions Definition Catalog
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique()->comment('Atomic Permission Code e.g. expenses.create, expenses.approve');
            $table->string('name')->comment('Human-readable Arabic name');
            $table->string('module')->comment('Module group e.g. expenses, users, system');
            $table->timestamps();
        });

        // Direct User Permissions Allocation (ADR-003)
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('permission_id')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
        Schema::dropIfExists('permissions');
    }
};
