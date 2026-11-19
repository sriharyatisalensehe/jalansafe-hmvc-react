<?php

namespace Modules\PelaporanJalan\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Modules\PelaporanJalan\Http\Requests\PelaporanJalanRequest;
use Modules\PelaporanJalan\Models\PelaporanJalan;

class PelaporanJalanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('PelaporanJalan::index');
    }

    public function getData(): JsonResponse
    {
        return response()->json(PelaporanJalan::latest()->get());
    }

    public function store(PelaporanJalanRequest $request): JsonResponse
    {
        $data = $request->safe()->except('foto_kerusakan');

        $file = $request->file('foto_kerusakan');
        $data['foto_kerusakan'] = $file->store('bukti_jalan', 'public');
        $data['nama_foto'] = $file->getClientOriginalName();
        $data['status_verifikasi'] = 'Menunggu Verifikasi';

        PelaporanJalan::create($data);

        return response()->json(['success' => 'Laporan kerusakan jalan berhasil dikirim.']);
    }

    public function edit(PelaporanJalan $pelaporanjalan): JsonResponse
    {
        return response()->json($pelaporanjalan);
    }

    public function update(PelaporanJalanRequest $request, PelaporanJalan $pelaporanjalan): JsonResponse
    {
        $data = $request->safe()->except('foto_kerusakan');

        if ($request->hasFile('foto_kerusakan')) {
            if ($pelaporanjalan->foto_kerusakan) {
                Storage::disk('public')->delete($pelaporanjalan->foto_kerusakan);
            }
            $file = $request->file('foto_kerusakan');
            $data['foto_kerusakan'] = $file->store('bukti_jalan', 'public');
            $data['nama_foto'] = $file->getClientOriginalName();
        }

        $pelaporanjalan->update($data);

        return response()->json(['success' => 'Laporan kerusakan jalan berhasil diperbarui.']);
    }

    public function destroy(PelaporanJalan $pelaporanjalan): JsonResponse
    {
        if ($pelaporanjalan->foto_kerusakan) {
            Storage::disk('public')->delete($pelaporanjalan->foto_kerusakan);
        }

        $pelaporanjalan->delete();

        return response()->json(['success' => 'Laporan berhasil dihapus.']);
    }
}
