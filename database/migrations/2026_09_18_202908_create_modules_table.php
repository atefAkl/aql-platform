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
        Schema::create('modules', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('name');
            $table->string('version')->default('1.0.0');
            $table->json('capabilities')->nullable();
            $table->json('dependencies')->nullable();
            $table->json('provisioning_metadata')->nullable();
            $table->string('status')->default('active')->comment('active, disabled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
