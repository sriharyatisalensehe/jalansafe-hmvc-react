<?php

namespace Modules\PelaporanJalan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PelaporanJalanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'nama_pelapor' => ['required', 'string', 'max:255'],
            'lokasi_jalan' => ['required', 'string', 'max:255'],
            'tingkat_kerusakan' => ['required', 'string', 'in:Ringan,Sedang,Rusak Berat'],
            'deskripsi' => ['required', 'string', 'max:1000'],
            'kontak_pelapor' => ['required', 'string', 'max:30'],
            'status_verifikasi' => ['nullable', 'string', 'max:50'],
        ];

        if ($this->isMethod('POST')) {
            $rules['foto_kerusakan'] = ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'];
        } else {
            $rules['foto_kerusakan'] = ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'];
        }

        return $rules;
    }
}
