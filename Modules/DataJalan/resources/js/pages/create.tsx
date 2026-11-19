import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { JalanForm } from '../components/jalan-form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_jalan: '',
        kecamatan: '',
        tipe_jalan: 'Jalan Kota/Kabupaten',
        panjang_km: '',
        kondisi: 'Baik',
        status_perbaikan: 'Belum Ditangani',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/datajalan');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Head title="Tambah Ruas Jalan" />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Tambah Data Ruas Jalan</h1>
                <p className="text-sm text-muted-foreground">
                    Form penambahan data master ruas jalan baru via Inertia useForm.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-xs">
                <JalanForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Simpan Data Jalan"
                />
            </div>
        </div>
    );
}
