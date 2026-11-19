# JalanSafe - Sistem Pelaporan & Pemantauan Kerusakan Jalan Kota Cerdas
> **Tugas Akhir Praktikum Pemrograman Aplikasi Berbasis Web (PABW) - Modul 9**  
> **Teknologi:** Laravel 11, React 19, TypeScript, Inertia.js 2, Tailwind CSS 4, shadcn/ui, `nwidart/laravel-modules`, Laravel Fortify, SQLite.

---

## 🏗️ Arsitektur Sistem (HMVC)
Aplikasi ini dibangun menggunakan arsitektur **Hierarchical Model-View-Controller (HMVC)** yang membagi sistem menjadi modul domain mandiri:
- `Modules/DataJalan`: Modul CRUD Synchronous berbasis **Inertia.js** untuk mengelola master data ruas jalan kota (khusus peran Dinas Bina Marga / Admin).
- `Modules/PelaporanJalan`: Modul CRUD Asynchronous berbasis **AJAX `fetch()` API** dan komponen dialog modal shadcn/ui untuk pelaporan kerusakan jalan oleh masyarakat (Warga / User) disertai bukti foto lapangan.
- `Modules/UserManagement`: Modul manajemen akun pengguna dan kontrol otorisasi peran.

---

## 🚀 Panduan Setup Mandiri via Terminal

Ikuti langkah-langkah berikut di terminal:

```bash
# 1. Salin environment
cp .env.example .env    # (Di Windows CMD: copy .env.example .env)

# 2. Instal dependensi PHP
composer install

# 3. Generate Application Key
php artisan key:generate

# 4. Migrasi dan jalankan seeder database
php artisan migrate:fresh --seed

# 5. Hubungkan symbolic link penyimpanan publik
php artisan storage:link

# 6. Instal dependensi frontend React
npm install

# 7. Kompilasi aset frontend
npm run build    # Atau gunakan `npm run dev` untuk mode hot reload

# 8. Jalankan server lokal Laravel
php artisan serve
```

Buka peramban di: **`http://127.0.0.1:8000`**

---

## 👥 Akun Login Demo

- **Admin (Dinas Bina Marga):**  
  Email: `admin@example.com` | Password: `password`  
  *Fitur: Master Data Ruas Jalan, Verifikasi Status Laporan, Dashboard Statistik.*

- **User (Warga Pelapor):**  
  Email: `user@example.com` | Password: `password`  
  *Fitur: Laporkan Kerusakan Jalan (AJAX + Foto), Riwayat Laporan.*

---

## 🧪 Pengujian Otomatis

Jalankan test suite untuk memastikan keandalan fungsional dan keamanan sistem:
```bash
php artisan test tests/Feature/JalanSafeTest.php
```
Semua 5 skenario (Guest Redirect, RBAC 403 Forbidden, CRUD Inertia, CRUD AJAX, File Upload & Deletion Lifecycle) telah teruji dan lolos 100%.
