# Panduan Setup Mandiri Aplikasi JalanSafe (HMVC React Starter Kit)
> **Tugas Akhir Praktikum PABW - Modul 9 (HMVC, Role-Based Access Control, dan CRUD AJAX)**

Panduan ini ditujukan untuk setup mandiri langsung melalui terminal (Command Prompt, PowerShell, atau Linux/macOS Bash) agar Anda memahami setiap tahapan konfigurasi pada Laravel 11 dan React 19 Starter Kit.

---

## 1. Prasyarat Sistem
Pastikan perangkat Anda sudah terinstal:
- **PHP** versi 8.2 atau lebih baru (`php -v`)
- **Composer** versi 2.x (`composer -v`)
- **Node.js** versi 18+ atau 20+ dan **npm** (`node -v` dan `npm -v`)
- Ekstensi PHP yang aktif: `pdo_sqlite`, `fileinfo`, `mbstring`, `openssl`, `curl`

---

## 2. Langkah-Langkah Setup via Terminal

Buka terminal di direktori proyek `jalansafe_hmvc_react`:

### Langkah 1: Salin Berkas Konfigurasi Lingkungan (`.env`)
Salin berkas `.env.example` menjadi `.env`:
- **Windows (Command Prompt):**
  ```cmd
  copy .env.example .env
  ```
- **Windows (PowerShell) / Linux / macOS:**
  ```bash
  cp .env.example .env
  ```

> *Penjelasan:* Berkas `.env` menyimpan pengaturan rahasia dan koneksi aplikasi. Konfigurasi bawaan sudah menggunakan `DB_CONNECTION=sqlite` sehingga Anda tidak perlu mengaktifkan MySQL/XAMPP.

---

### Langkah 2: Instal Dependensi Backend (Composer)
Jalankan perintah instalasi pustaka backend:
```bash
composer install
```
> *Penjelasan:* Mengunduh paket Laravel framework, modul HMVC (`nwidart/laravel-modules`), dan merge-plugin ke folder `vendor/`.

---

### Langkah 3: Generate Application Encryption Key
Buat kunci enkripsi aplikasi:
```bash
php artisan key:generate
```
> *Penjelasan:* Menghasilkan kunci rahasia unik (`APP_KEY`) di berkas `.env` untuk enkripsi session dan data sensitif.

---

### Langkah 4: Migrasi Basis Data dan Jalankan Seeder
Siapkan tabel dan isi data awal ke database SQLite:
```bash
php artisan migrate:fresh --seed
```
Jika muncul pertanyaan *`Database file at ... does not exist. Would you like to create it?`*, ketik **`yes`** lalu tekan Enter.

> *Penjelasan:* 
> - Menjalankan file migrasi tabel pengguna, master ruas jalan (`Modules/DataJalan`), dan pelaporan kerusakan jalan (`Modules/PelaporanJalan`).
> - Mengisi data contoh jalan serta akun login untuk Dinas Bina Marga (Admin) dan Warga Pelapor (User).

---

### Langkah 5: Hubungkan Symbolic Link Storage (Penyimpanan Berkas)
Aktifkan tautan simbolik agar berkas foto bukti kerusakan jalan dapat diakses oleh browser:
```bash
php artisan storage:link
```
> *Penjelasan:* Menghubungkan folder `public/storage` ke `storage/app/public`. Tanpa perintah ini, gambar yang diupload tidak akan bisa ditampilkan di web.

---

### Langkah 6: Instal Dependensi Frontend (npm)
Instal seluruh dependensi React 19, Inertia.js 2, Tailwind CSS, dan komponen shadcn/ui:
```bash
npm install
```

---

### Langkah 7: Kompilasi / Jalankan Frontend Asset (Vite)
Anda memiliki 2 opsi:

- **Opsi A (Mode Pengembang / Hot Reload):**
  Buka tab terminal baru, lalu jalankan:
  ```bash
  npm run dev
  ```
  *(Biarkan terminal ini tetap menyala selama proses pengembangan)*

- **Opsi B (Mode Kompilasi Produksi / Cukup Sekali Jalan):**
  ```bash
  npm run build
  ```
  *(Mengompilasi seluruh aset React SPA ke folder `public/build/`)*

---

### Langkah 8: Jalankan Web Server Lokal Laravel
Di terminal utama, jalankan server pengembangan Laravel:
```bash
php artisan serve
```

Aplikasi kini aktif dan dapat diakses melalui peramban web di:
👉 **`http://127.0.0.1:8000`** atau **`http://localhost:8000`**

---

## 3. Informasi Akun untuk Uji Coba

Database sudah terisi 2 akun dengan hak akses (role) berbeda:

| Peran (Role) | Alamat Email | Kata Sandi | Hak Akses & Fitur |
|---|---|---|---|
| **Admin (Dinas Bina Marga)** | `admin@example.com` | `password` | Mengelola Master Ruas Jalan (CRUD Inertia), Meninjau dan memverifikasi status laporan jalan. |
| **User (Warga Pelapor)** | `user@example.com` | `password` | Melaporkan jalan rusak via modal AJAX + upload foto bukti (CRUD AJAX). Dilarang mengedit master jalan (HTTP 403 Forbidden). |

---

## 4. Menguji Otomatisasi Sistem (Feature Testing)

Untuk memverifikasi bahwa seluruh rute, otorisasi peran (RBAC), upload berkas, dan endpoint JSON berfungsi dengan benar:
```bash
php artisan test tests/Feature/JalanSafeTest.php
```

Seluruh pengujian mencakup:
1. `test_guest_is_redirected_to_login`: Tamu otomatis dialihkan ke halaman login.
2. `test_citizen_can_view_roads_but_cannot_create_road`: Warga biasa dilarang mengakses form tambah ruas jalan (HTTP 403 Forbidden).
3. `test_citizen_cannot_access_user_management`: Warga dilarang mengakses manajemen pengguna (HTTP 403 Forbidden).
4. `test_admin_can_perform_crud_on_data_jalan`: Admin dapat menambah, mengedit, dan menghapus ruas jalan via Inertia.
5. `test_ajax_pelaporan_jalan_crud_with_photo_upload`: Operasi CRUD AJAX penuh beserta validasi foto dan penghapusan fisik berkas saat data dihapus.

---

## 5. Ringkasan Perintah Cepat (Cheatsheet)
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
npm install
npm run build
php artisan serve
```
Selamat belajar dan bereksplorasi dengan arsitektur HMVC dan React 19! 🚀
