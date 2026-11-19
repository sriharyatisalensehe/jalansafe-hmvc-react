import { Link } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type JalanFormProps = {
    data: {
        nama_jalan: string;
        kecamatan: string;
        tipe_jalan: string;
        panjang_km: string | number;
        kondisi: string;
        status_perbaikan: string;
    };
    setData: (key: any, value?: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
    submitLabel: string;
};

export function JalanForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
}: JalanFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <Label htmlFor="nama_jalan">Nama Ruas Jalan</Label>
                <Input
                    id="nama_jalan"
                    value={data.nama_jalan}
                    onChange={(e) => setData('nama_jalan', e.target.value)}
                    placeholder="Contoh: Jl. Sukabumi No. 12"
                    required
                />
                <InputError message={errors.nama_jalan} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input
                        id="kecamatan"
                        value={data.kecamatan}
                        onChange={(e) => setData('kecamatan', e.target.value)}
                        placeholder="Contoh: Bandung Wetan"
                        required
                    />
                    <InputError message={errors.kecamatan} />
                </div>

                <div>
                    <Label htmlFor="tipe_jalan">Tipe Jalan</Label>
                    <select
                        id="tipe_jalan"
                        value={data.tipe_jalan}
                        onChange={(e) => setData('tipe_jalan', e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    >
                        <option value="">Pilih Tipe Jalan</option>
                        <option value="Jalan Nasional">Jalan Nasional</option>
                        <option value="Jalan Provinsi">Jalan Provinsi</option>
                        <option value="Jalan Kota/Kabupaten">Jalan Kota/Kabupaten</option>
                    </select>
                    <InputError message={errors.tipe_jalan} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="panjang_km">Panjang Jalan (KM)</Label>
                    <Input
                        id="panjang_km"
                        type="number"
                        step="0.01"
                        value={data.panjang_km}
                        onChange={(e) => setData('panjang_km', e.target.value)}
                        placeholder="Contoh: 3.5"
                        required
                    />
                    <InputError message={errors.panjang_km} />
                </div>

                <div>
                    <Label htmlFor="kondisi">Kondisi Jalan</Label>
                    <select
                        id="kondisi"
                        value={data.kondisi}
                        onChange={(e) => setData('kondisi', e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    >
                        <option value="Baik">Baik</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Rusak Sedang">Rusak Sedang</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                    <InputError message={errors.kondisi} />
                </div>
            </div>

            <div>
                <Label htmlFor="status_perbaikan">Status Penanganan</Label>
                <select
                    id="status_perbaikan"
                    value={data.status_perbaikan}
                    onChange={(e) => setData('status_perbaikan', e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <option value="Belum Ditangani">Belum Ditangani</option>
                    <option value="Masuk Antrean">Masuk Antrean</option>
                    <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                    <option value="Selesai">Selesai</option>
                </select>
                <InputError message={errors.status_perbaikan} />
            </div>

            <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" asChild>
                    <Link href="/datajalan">Batal</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
