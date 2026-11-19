<?php

namespace Modules\DataJalan\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DataJalanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'nama_jalan' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'tipe_jalan' => ['required', 'string', 'max:100'],
            'panjang_km' => ['required', 'numeric', 'min:0.1', 'max:500'],
            'kondisi' => ['required', 'string', 'in:Baik,Rusak Ringan,Rusak Sedang,Rusak Berat'],
            'status_perbaikan' => ['nullable', 'string', 'max:100'],
        ];
    }
}
