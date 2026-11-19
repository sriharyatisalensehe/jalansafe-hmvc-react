<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_jalans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jalan');
            $table->string('kecamatan');
            $table->string('tipe_jalan');
            $table->decimal('panjang_km', 6, 2);
            $table->string('kondisi'); // Baik, Rusak Ringan, Rusak Sedang, Rusak Berat
            $table->string('status_perbaikan')->default('Belum Ditangani');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_jalans');
    }
};
