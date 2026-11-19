<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Modules\DataJalan\Models\DataJalan;
use Modules\PelaporanJalan\Models\PelaporanJalan;
use Tests\TestCase;

class JalanSafeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/datajalan');
        $response->assertRedirect('/login');

        $response = $this->get('/pelaporanjalan');
        $response->assertRedirect('/login');
    }

    public function test_citizen_can_view_roads_but_cannot_create_road(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/datajalan');
        $response->assertStatus(200);

        // Warga biasa dilarang mengakses form create ruas jalan (khusus admin/Bina Marga)
        $response = $this->actingAs($user)->get('/datajalan/create');
        $response->assertStatus(403);
    }

    public function test_citizen_cannot_access_user_management(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_perform_crud_on_data_jalan(): void
    {
        $admin = User::factory()->admin()->create();

        // 1. Create DataJalan via Inertia/Server
        $response = $this->actingAs($admin)->post('/datajalan', [
            'nama_jalan' => 'Jl. Bojongsoang Raya KM 5',
            'kecamatan' => 'Bojongsoang',
            'tipe_jalan' => 'Jalan Provinsi',
            'panjang_km' => 3.75,
            'kondisi' => 'Rusak Ringan',
            'status_perbaikan' => 'Belum Ditangani',
        ]);
        $response->assertRedirect('/datajalan');
        $this->assertDatabaseHas('data_jalans', ['nama_jalan' => 'Jl. Bojongsoang Raya KM 5']);

        $jalan = DataJalan::where('nama_jalan', 'Jl. Bojongsoang Raya KM 5')->first();

        // 2. Update DataJalan
        $response = $this->actingAs($admin)->put("/datajalan/{$jalan->id}", [
            'nama_jalan' => 'Jl. Bojongsoang Raya KM 5 Selesai',
            'kecamatan' => 'Bojongsoang',
            'tipe_jalan' => 'Jalan Provinsi',
            'panjang_km' => 3.75,
            'kondisi' => 'Baik',
            'status_perbaikan' => 'Selesai',
        ]);
        $response->assertRedirect('/datajalan');
        $this->assertDatabaseHas('data_jalans', ['nama_jalan' => 'Jl. Bojongsoang Raya KM 5 Selesai']);

        // 3. Delete DataJalan
        $response = $this->actingAs($admin)->delete("/datajalan/{$jalan->id}");
        $response->assertRedirect('/datajalan');
        $this->assertDatabaseMissing('data_jalans', ['id' => $jalan->id]);
    }

    public function test_ajax_pelaporan_jalan_crud_with_photo_upload(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $photo = UploadedFile::fake()->create('jalan_rusak_lubang.jpg', 600, 'image/jpeg');

        // 1. Store via AJAX JSON request
        $response = $this->actingAs($user)->postJson('/pelaporanjalan', [
            'nama_pelapor' => 'Andika Ramadhan',
            'kontak_pelapor' => '081234567890',
            'lokasi_jalan' => 'Jl. Sukabumi No. 45',
            'tingkat_kerusakan' => 'Rusak Berat',
            'deskripsi' => 'Lubang jalan sedalam 15 cm membahayakan pengendara roda dua.',
            'foto_kerusakan' => $photo,
        ]);
        $response->assertStatus(200);
        $response->assertJson(['success' => 'Laporan kerusakan jalan berhasil dikirim.']);

        $pelaporan = PelaporanJalan::first();
        $this->assertNotNull($pelaporan);
        Storage::disk('public')->assertExists($pelaporan->foto_kerusakan);

        // 2. Get Data JSON for AJAX Table
        $response = $this->actingAs($user)->getJson('/pelaporanjalan/data');
        $response->assertStatus(200);
        $response->assertJsonFragment(['lokasi_jalan' => 'Jl. Sukabumi No. 45']);

        // 3. Update via AJAX
        $response = $this->actingAs($user)->putJson("/pelaporanjalan/{$pelaporan->id}", [
            'nama_pelapor' => 'Andika Ramadhan',
            'kontak_pelapor' => '081234567890',
            'lokasi_jalan' => 'Jl. Sukabumi No. 45 Depan Puskesmas',
            'tingkat_kerusakan' => 'Rusak Berat',
            'deskripsi' => 'Kerusakan semakin melebar setelah diguyur hujan deras.',
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('pelaporan_jalans', [
            'id' => $pelaporan->id,
            'lokasi_jalan' => 'Jl. Sukabumi No. 45 Depan Puskesmas',
        ]);

        // 4. Delete via AJAX and Verify File Cleanup
        $filePath = $pelaporan->foto_kerusakan;
        $response = $this->actingAs($user)->deleteJson("/pelaporanjalan/{$pelaporan->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('pelaporan_jalans', ['id' => $pelaporan->id]);
        Storage::disk('public')->assertMissing($filePath);
    }
}
