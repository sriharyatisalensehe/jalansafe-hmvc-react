<?php

namespace Modules\DataJalan\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\DataJalan\Http\Requests\DataJalanRequest;
use Modules\DataJalan\Models\DataJalan;

class DataJalanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $jalans = DataJalan::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('nama_jalan', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('tipe_jalan', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama_jalan')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('DataJalan::index', [
            'jalans' => $jalans,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DataJalan::create');
    }

    public function store(DataJalanRequest $request): RedirectResponse
    {
        DataJalan::create($request->validated());

        return redirect()->route('datajalan.index')
            ->with('success', 'Data ruas jalan berhasil ditambahkan.');
    }

    public function edit(DataJalan $datajalan): Response
    {
        return Inertia::render('DataJalan::edit', [
            'jalan' => $datajalan,
        ]);
    }

    public function update(DataJalanRequest $request, DataJalan $datajalan): RedirectResponse
    {
        $datajalan->update($request->validated());

        return redirect()->route('datajalan.index')
            ->with('success', 'Data ruas jalan berhasil diperbarui.');
    }

    public function destroy(Request $request, DataJalan $datajalan): RedirectResponse
    {
        if (! $request->user()?->isAdmin()) {
            abort(403, 'Aksi ini tidak diizinkan untuk peran Anda.');
        }

        $datajalan->delete();

        return redirect()->route('datajalan.index')
            ->with('success', 'Data ruas jalan berhasil dihapus.');
    }
}
