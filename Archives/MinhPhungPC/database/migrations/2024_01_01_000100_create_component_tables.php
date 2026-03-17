<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('processor', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 50)->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->unsignedInteger('core_count')->nullable();
            $table->unsignedInteger('thread_count')->nullable();
            $table->string('socket_type', 50)->nullable();
            $table->unsignedInteger('tdp')->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('motherboard', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 50)->nullable();
            $table->string('name')->nullable();
            $table->string('socket_type', 50)->nullable();
            $table->string('chipset', 50)->nullable();
            $table->unsignedInteger('memory_slots')->nullable();
            $table->unsignedInteger('max_memory_capacity')->nullable();
            $table->string('ddr', 10)->nullable();
            $table->string('expansion_slots')->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('memory', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->string('brand', 100);
            $table->unsignedInteger('price');
            $table->text('image')->nullable();
            $table->unsignedInteger('ddr')->nullable();
            $table->string('capacity', 50)->nullable();
            $table->string('speed', 100)->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('graphicscard', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 50)->nullable();
            $table->unsignedInteger('vram_capacity')->nullable();
            $table->unsignedInteger('cuda_cores')->nullable();
            $table->unsignedInteger('tdp')->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('storage', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 100)->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->string('type', 20)->nullable();
            $table->string('capacity', 50)->nullable();
            $table->string('speed', 100)->nullable();
            $table->string('port', 50)->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('powersupply', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 100)->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->unsignedInteger('wattage')->nullable();
            $table->string('efficiency_rating', 50)->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('cpucooler', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 50)->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->string('cooling_type', 20)->nullable();
            $table->string('socket')->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('pccase', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->string('brand', 100)->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->string('size', 100)->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });

        Schema::create('operatingsystem', function (Blueprint $table) {
            $table->id();
            $table->text('name')->nullable();
            $table->text('version')->nullable();
            $table->unsignedInteger('price')->nullable();
            $table->text('image')->nullable();
            $table->string('brand', 50)->nullable();
            $table->text('ratings')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operatingsystem');
        Schema::dropIfExists('pccase');
        Schema::dropIfExists('cpucooler');
        Schema::dropIfExists('powersupply');
        Schema::dropIfExists('storage');
        Schema::dropIfExists('graphicscard');
        Schema::dropIfExists('memory');
        Schema::dropIfExists('motherboard');
        Schema::dropIfExists('processor');
    }
};
