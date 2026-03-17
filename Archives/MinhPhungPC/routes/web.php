<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BuildSetController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('builder');
Route::get('/search/suggest', [SearchController::class, 'suggest'])->name('search.suggest');
Route::get('/search', [SearchController::class, 'results'])->name('search');

Route::get('/builder/components', [BuildSetController::class, 'available'])->name('builder.components');
Route::post('/builder/update', [BuildSetController::class, 'update'])->name('builder.update');
Route::post('/builder/remove', [BuildSetController::class, 'remove'])->name('builder.remove');
Route::post('/builder/clear', [BuildSetController::class, 'clear'])->name('builder.clear');
Route::post('/builder/add-to-cart', [BuildSetController::class, 'addToCart'])->name('builder.add-to-cart');
Route::get('/builder/replace', [BuildSetController::class, 'replace'])->name('builder.replace');
Route::get('/builder/discard', [BuildSetController::class, 'discard'])->name('builder.discard');

Route::get('/categories/{table}', [CategoryController::class, 'show'])->name('categories.show');

Route::get('/items/{table}/{id}', [ItemController::class, 'show'])->name('items.show');
Route::post('/items/{table}/{id}', [ItemController::class, 'store'])->name('items.store');

Route::middleware('auth')->group(function () {
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/update', [CartController::class, 'updateQuantity'])->name('cart.update');
    Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

    Route::get('/account', [AccountController::class, 'index'])->name('account.index');
    Route::post('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::post('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::post('/orders/{order}/cancel', [AccountController::class, 'cancelOrder'])->name('orders.cancel');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
