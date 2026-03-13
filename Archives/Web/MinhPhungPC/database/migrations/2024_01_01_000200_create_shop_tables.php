<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->id('admin_id');
            $table->string('username')->unique();
            $table->string('password_hash');
            $table->timestamps();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id('comment_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->string('product_table')->nullable();
            $table->text('content')->nullable();
            $table->timestamp('time')->nullable();
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->text('items')->nullable();
            $table->timestamp('order_date')->nullable();
            $table->enum('status', ['pending', 'processed', 'shipped', 'delivered', 'cancelled'])->nullable();
            $table->unsignedInteger('total_amount')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->enum('payment_method', ['Bank', 'COD'])->nullable();
            $table->enum('payment_status', ['pending', 'paid', 'cancelled'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('admin');
    }
};
