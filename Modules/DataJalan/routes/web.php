<?php

use Illuminate\Support\Facades\Route;
use Modules\DataJalan\Http\Controllers\DataJalanController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('datajalan', [DataJalanController::class, 'index'])->name('datajalan.index');
    Route::middleware('role:admin')->group(function () {
        Route::get('datajalan/create', [DataJalanController::class, 'create'])->name('datajalan.create');
        Route::post('datajalan', [DataJalanController::class, 'store'])->name('datajalan.store');
        Route::get('datajalan/{datajalan}/edit', [DataJalanController::class, 'edit'])->name('datajalan.edit');
        Route::put('datajalan/{datajalan}', [DataJalanController::class, 'update'])->name('datajalan.update');
        Route::delete('datajalan/{datajalan}', [DataJalanController::class, 'destroy'])->name('datajalan.destroy');
    });
});
