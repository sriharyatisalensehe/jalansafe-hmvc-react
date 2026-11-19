import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSharedProps } from '@/hooks/use-shared-props';

type JalanRow = {
    id: number;
    nama_jalan: string;
    kecamatan: string;
    tipe_jalan: string;
    panjang_km: number;
    kondisi: string;
    status_perbaikan: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };

type Props = {
    jalans: {
        data: JalanRow[];
        links: PaginationLink[];
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: { search?: string };
};

export default function Index({ jalans, filters }: Props) {
    const { auth } = useSharedProps();
    const isAdmin = auth.user?.role === 'admin';

    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteTarget, setDeleteTarget] = useState<JalanRow | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/datajalan', { search }, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/datajalan/${deleteTarget.id}`, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <Head title="Master Data Ruas Jalan" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Master Data Ruas Jalan</h1>
                    <p className="text-sm text-muted-foreground">
                        Modul pengelolaan master data ruas jalan kota (CRUD Inertia.js).
                    </p>
                </div>
                {isAdmin && (
                    <Button asChild>
                        <Link href="/datajalan/create">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Jalan
                        </Link>
                    </Button>
                )}
            </div>

            <FlashMessage />

            <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
                    <Input
                        placeholder="Cari nama jalan / kecamatan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="submit" variant="secondary" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="py-3 px-4 text-left font-medium">Nama Jalan</th>
                            <th className="py-3 px-4 text-left font-medium">Kecamatan</th>
                            <th className="py-3 px-4 text-left font-medium">Tipe</th>
                            <th className="py-3 px-4 text-left font-medium">Panjang</th>
                            <th className="py-3 px-4 text-left font-medium">Kondisi</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            {isAdmin && <th className="py-3 px-4 text-right font-medium">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {jalans.data.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-muted-foreground">
                                    Belum ada data ruas jalan.
                                </td>
                            </tr>
                        ) : (
                            jalans.data.map((j) => (
                                <tr key={j.id} className="hover:bg-muted/20">
                                    <td className="py-3 px-4 font-semibold">{j.nama_jalan}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{j.kecamatan}</td>
                                    <td className="py-3 px-4">{j.tipe_jalan}</td>
                                    <td className="py-3 px-4">{j.panjang_km} KM</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            j.kondisi === 'Baik' ? 'bg-green-100 text-green-800' :
                                            j.kondisi === 'Rusak Ringan' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {j.kondisi}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{j.status_perbaikan}</td>
                                    {isAdmin && (
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/datajalan/${j.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteTarget(j)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {jalans.links && jalans.links.length > 3 && (
                <div className="flex justify-center gap-1 pt-4">
                    {jalans.links.map((link, idx) => (
                        <Button
                            key={idx}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            asChild={Boolean(link.url)}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </Button>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Hapus Data Jalan?"
                description={`Apakah Anda yakin ingin menghapus data ruas ${deleteTarget?.nama_jalan}?`}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
