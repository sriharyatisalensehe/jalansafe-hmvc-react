<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pelaporan_jalans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pelapor');
            $table->string('lokasi_jalan');
            $table->string('tingkat_kerusakan'); // Ringan, Sedang, Rusak Berat
            $table->text('deskripsi');
            $table->string('kontak_pelapor', 30);
            $table->string('foto_kerusakan')->nullable();
            $table->string('nama_foto')->nullable();
            $table->string('status_verifikasi')->default('Menunggu Verifikasi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pelaporan_jalans');
    }
};
