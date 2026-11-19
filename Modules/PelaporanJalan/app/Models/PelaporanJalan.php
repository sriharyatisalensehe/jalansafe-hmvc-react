<?php

namespace Modules\PelaporanJalan\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class PelaporanJalan extends Model
{
    protected $table = 'pelaporan_jalans';

    protected $fillable = [
        'nama_pelapor',
        'lokasi_jalan',
        'tingkat_kerusakan',
        'deskripsi',
        'kontak_pelapor',
        'foto_kerusakan',
        'nama_foto',
        'status_verifikasi',
    ];

    protected $appends = [
        'foto_url',
    ];

    protected function fotoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->foto_kerusakan ? asset('storage/'.$this->foto_kerusakan) : null);
    }
}
