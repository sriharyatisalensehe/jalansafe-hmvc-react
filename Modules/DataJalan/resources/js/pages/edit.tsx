import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { JalanForm } from '../components/jalan-form';

type Jalan = {
    id: number;
    nama_jalan: string;
    kecamatan: string;
    tipe_jalan: string;
    panjang_km: number;
    kondisi: string;
    status_perbaikan: string;
};

type Props = {
    jalan: Jalan;
};

export default function Edit({ jalan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_jalan: jalan.nama_jalan,
        kecamatan: jalan.kecamatan,
        tipe_jalan: jalan.tipe_jalan,
        panjang_km: jalan.panjang_km,
        kondisi: jalan.kondisi,
        status_perbaikan: jalan.status_perbaikan,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/datajalan/${jalan.id}`);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Head title={`Edit Ruas Jalan - ${jalan.nama_jalan}`} />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Ubah Data Ruas Jalan</h1>
                <p className="text-sm text-muted-foreground">
                    Perbarui data master ruas jalan {jalan.nama_jalan}.
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-xs">
                <JalanForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    submitLabel="Perbarui Data Jalan"
                />
            </div>
        </div>
    );
}
