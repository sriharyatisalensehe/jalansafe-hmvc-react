<?php

namespace Modules\DataJalan\Models;

use Illuminate\Database\Eloquent\Model;

class DataJalan extends Model
{
    protected $table = 'data_jalans';

    protected $fillable = [
        'nama_jalan',
        'kecamatan',
        'tipe_jalan',
        'panjang_km',
        'kondisi',
        'status_perbaikan',
    ];
}
