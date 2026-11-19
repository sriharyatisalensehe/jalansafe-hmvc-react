<?php

use Illuminate\Support\Facades\Route;
use Modules\PelaporanJalan\Http\Controllers\PelaporanJalanController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('pelaporanjalan', [PelaporanJalanController::class, 'index'])->name('pelaporanjalan.index');
    Route::get('pelaporanjalan/data', [PelaporanJalanController::class, 'getData'])->name('pelaporanjalan.data');
    Route::post('pelaporanjalan', [PelaporanJalanController::class, 'store'])->name('pelaporanjalan.store');
    Route::get('pelaporanjalan/{pelaporanjalan}/edit', [PelaporanJalanController::class, 'edit'])->name('pelaporanjalan.edit');
    Route::put('pelaporanjalan/{pelaporanjalan}', [PelaporanJalanController::class, 'update'])->name('pelaporanjalan.update');
    Route::delete('pelaporanjalan/{pelaporanjalan}', [PelaporanJalanController::class, 'destroy'])->name('pelaporanjalan.destroy');
});
