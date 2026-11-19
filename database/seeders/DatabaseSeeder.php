<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\DataJalan\Models\DataJalan;
use Modules\PelaporanJalan\Models\PelaporanJalan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Pengguna Role
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Petugas Dinas Bina Marga',
                'role' => 'admin',
                'password' => bcrypt('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Andika Ramadhan (Warga)',
                'role' => 'user',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Data Master Ruas Jalan (CRUD Inertia)
        $jalans = [
            [
                'nama_jalan' => 'Jl. Ir. H. Juanda (Dago)',
                'kecamatan' => 'Coblong',
                'tipe_jalan' => 'Jalan Kota/Kabupaten',
                'panjang_km' => 4.25,
                'kondisi' => 'Baik',
                'status_perbaikan' => 'Selesai',
            ],
            [
                'nama_jalan' => 'Jl. Soekarno-Hatta (By Pass)',
                'kecamatan' => 'Batununggal',
                'tipe_jalan' => 'Jalan Nasional',
                'panjang_km' => 18.50,
                'kondisi' => 'Rusak Sedang',
                'status_perbaikan' => 'Sedang Dikerjakan',
            ],
            [
                'nama_jalan' => 'Jl. Terusan Buah Batu',
                'kecamatan' => 'Bojongsoang',
                'tipe_jalan' => 'Jalan Provinsi',
                'panjang_km' => 3.80,
                'kondisi' => 'Rusak Ringan',
                'status_perbaikan' => 'Masuk Antrean',
            ],
            [
                'nama_jalan' => 'Jl. Raya Dayeuhkolot',
                'kecamatan' => 'Dayeuhkolot',
                'tipe_jalan' => 'Jalan Provinsi',
                'panjang_km' => 5.10,
                'kondisi' => 'Rusak Berat',
                'status_perbaikan' => 'Sedang Dikerjakan',
            ],
            [
                'nama_jalan' => 'Jl. Dipatiukur',
                'kecamatan' => 'Coblong',
                'tipe_jalan' => 'Jalan Kota/Kabupaten',
                'panjang_km' => 2.15,
                'kondisi' => 'Baik',
                'status_perbaikan' => 'Selesai',
            ],
        ];

        foreach ($jalans as $j) {
            DataJalan::updateOrCreate(['nama_jalan' => $j['nama_jalan']], $j);
        }

        // 3. Data Pelaporan Kerusakan Jalan (CRUD AJAX)
        $laporans = [
            [
                'nama_pelapor' => 'Andika Ramadhan',
                'lokasi_jalan' => 'Jl. Raya Dayeuhkolot KM 4.2',
                'tingkat_kerusakan' => 'Rusak Berat',
                'deskripsi' => 'Terdapat lubang besar berdiameter 1 meter sedalam 15 cm di dekat pertigaan jembatan Citarum yang membahayakan pengendara motor.',
                'kontak_pelapor' => '081234567890',
                'foto_kerusakan' => 'bukti_jalan/jalan_rusak_dayeuhkolot.png',
                'nama_foto' => 'jalan_rusak_dayeuhkolot.png',
                'status_verifikasi' => 'Terverifikasi',
            ],
            [
                'nama_pelapor' => 'Budi Santoso',
                'lokasi_jalan' => 'Jl. Terusan Buah Batu Depan SPBU',
                'tingkat_kerusakan' => 'Sedang',
                'deskripsi' => 'Aspal mengelupas dan bergelombang parah setelah hujan lebat.',
                'kontak_pelapor' => '089876543210',
                'foto_kerusakan' => 'bukti_jalan/retak_buahbatu.jpg',
                'nama_foto' => 'retak_buahbatu.jpg',
                'status_verifikasi' => 'Menunggu Verifikasi',
            ],
        ];

        foreach ($laporans as $l) {
            PelaporanJalan::updateOrCreate(['lokasi_jalan' => $l['lokasi_jalan']], $l);
        }
    }
}
