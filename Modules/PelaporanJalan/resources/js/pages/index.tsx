import { Head } from '@inertiajs/react';
import { Camera, FileText, LoaderCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertMessage } from '@/components/alert-message';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { http, HttpError } from '@/lib/http';
import type { ValidationErrors } from '@/lib/http';

type Laporan = {
    id: number;
    nama_pelapor: string;
    lokasi_jalan: string;
    tingkat_kerusakan: string;
    deskripsi: string;
    kontak_pelapor: string;
    foto_kerusakan: string | null;
    nama_foto: string | null;
    foto_url: string | null;
    status_verifikasi: string;
    created_at: string;
};

type FormFields = {
    nama_pelapor: string;
    lokasi_jalan: string;
    tingkat_kerusakan: string;
    deskripsi: string;
    kontak_pelapor: string;
    status_verifikasi: string;
};

type Message = { type: 'success' | 'error'; text: string } | null;

const emptyForm: FormFields = {
    nama_pelapor: '',
    lokasi_jalan: '',
    tingkat_kerusakan: 'Sedang',
    deskripsi: '',
    kontak_pelapor: '',
    status_verifikasi: 'Menunggu Verifikasi',
};

export default function Index() {
    const [laporans, setLaporans] = useState<Laporan[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormFields>(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<Message>(null);
    const [deleteTarget, setDeleteTarget] = useState<Laporan | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await http.get<Laporan[]>('/pelaporanjalan/data');
            setLaporans(data);
        } catch {
            setMessage({ type: 'error', text: 'Gagal memuat data laporan kerusakan jalan.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return laporans;
        return laporans.filter(
            (l) =>
                l.nama_pelapor.toLowerCase().includes(q) ||
                l.lokasi_jalan.toLowerCase().includes(q) ||
                l.deskripsi.toLowerCase().includes(q)
        );
    }, [laporans, search]);

    const openCreateDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFile(null);
        setCurrentFileUrl(null);
        setCurrentFileName(null);
        setErrors({});
        setDialogOpen(true);
    };

    const openEditDialog = async (l: Laporan) => {
        setEditingId(l.id);
        setForm({
            nama_pelapor: l.nama_pelapor,
            lokasi_jalan: l.lokasi_jalan,
            tingkat_kerusakan: l.tingkat_kerusakan,
            deskripsi: l.deskripsi,
            kontak_pelapor: l.kontak_pelapor,
            status_verifikasi: l.status_verifikasi,
        });
        setFile(null);
        setCurrentFileUrl(l.foto_url);
        setCurrentFileName(l.nama_foto);
        setErrors({});
        setDialogOpen(true);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0] ?? null;
        setFile(picked);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setMessage(null);

        const body = new FormData();
        body.append('nama_pelapor', form.nama_pelapor);
        body.append('lokasi_jalan', form.lokasi_jalan);
        body.append('tingkat_kerusakan', form.tingkat_kerusakan);
        body.append('deskripsi', form.deskripsi);
        body.append('kontak_pelapor', form.kontak_pelapor);
        body.append('status_verifikasi', form.status_verifikasi);

        if (file) {
            body.append('foto_kerusakan', file);
        }

        try {
            if (editingId === null) {
                const res = await http.post<{ success: string }>('/pelaporanjalan', body);
                setMessage({ type: 'success', text: res.success });
            } else {
                body.append('_method', 'PUT');
                const res = await http.post<{ success: string }>(`/pelaporanjalan/${editingId}`, body);
                setMessage({ type: 'success', text: res.success });
            }
            setDialogOpen(false);
            await loadData();
        } catch (err) {
            if (err instanceof HttpError && err.status === 422) {
                setErrors(err.errors);
            } else {
                setMessage({ type: 'error', text: 'Terjadi kesalahan sistem saat menyimpan.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await http.delete<{ success: string }>(`/pelaporanjalan/${deleteTarget.id}`);
            setMessage({ type: 'success', text: res.success });
            await loadData();
        } catch {
            setMessage({ type: 'error', text: 'Gagal menghapus laporan.' });
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <Head title="Pelaporan Kerusakan Jalan" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pelaporan Kerusakan Jalan (JalanSafe)</h1>
                    <p className="text-sm text-muted-foreground">
                        Modul partisipasi masyarakat pelaporan jalan rusak secara asinkron (CRUD AJAX + File Upload).
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" /> Buat Laporan Kerusakan
                </Button>
            </div>

            {message && <AlertMessage type={message.type} message={message.text} />}

            <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari lokasi jalan / nama pelapor..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="outline">Total Laporan: {filtered.length}</Badge>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="py-3 px-4 text-left font-medium">Pelapor</th>
                            <th className="py-3 px-4 text-left font-medium">Lokasi Jalan</th>
                            <th className="py-3 px-4 text-left font-medium">Tingkat Kerusakan</th>
                            <th className="py-3 px-4 text-left font-medium">Foto Bukti</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-right font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                    <LoaderCircle className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Memuat data laporan via AJAX...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                    Belum ada data laporan kerusakan jalan.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((l) => (
                                <tr key={l.id} className="hover:bg-muted/20">
                                    <td className="py-3 px-4 font-semibold">{l.nama_pelapor}</td>
                                    <td className="py-3 px-4">{l.lokasi_jalan}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            l.tingkat_kerusakan === 'Ringan' ? 'bg-yellow-100 text-yellow-800' :
                                            l.tingkat_kerusakan === 'Sedang' ? 'bg-orange-100 text-orange-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {l.tingkat_kerusakan}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {l.foto_url ? (
                                            <a
                                                href={l.foto_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary inline-flex items-center gap-1 hover:underline text-xs"
                                            >
                                                <Camera className="h-3.5 w-3.5" />
                                                {l.nama_foto ?? 'Lihat Foto'}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">Tanpa foto</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge variant={l.status_verifikasi === 'Terverifikasi' ? 'default' : 'secondary'}>
                                            {l.status_verifikasi}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(l)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteTarget(l)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Dialog Form */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId === null ? 'Buat Laporan Kerusakan Jalan' : 'Ubah Laporan Kerusakan'}
                        </DialogTitle>
                        <DialogDescription>
                            Sampaikan detail kerusakan jalan. Data diproses secara instan via AJAX.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="nama_pelapor">Nama Pelapor</Label>
                            <Input
                                id="nama_pelapor"
                                value={form.nama_pelapor}
                                onChange={(e) => setForm({ ...form, nama_pelapor: e.target.value })}
                                placeholder="Nama lengkap Anda"
                            />
                            <InputError message={errors.nama_pelapor?.[0]} />
                        </div>

                        <div>
                            <Label htmlFor="lokasi_jalan">Lokasi / Nama Jalan</Label>
                            <Input
                                id="lokasi_jalan"
                                value={form.lokasi_jalan}
                                onChange={(e) => setForm({ ...form, lokasi_jalan: e.target.value })}
                                placeholder="Contoh: Jl. Dipatiukur No. 45"
                            />
                            <InputError message={errors.lokasi_jalan?.[0]} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tingkat_kerusakan">Tingkat Kerusakan</Label>
                                <select
                                    id="tingkat_kerusakan"
                                    value={form.tingkat_kerusakan}
                                    onChange={(e) => setForm({ ...form, tingkat_kerusakan: e.target.value })}
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="Ringan">Ringan</option>
                                    <option value="Sedang">Sedang</option>
                                    <option value="Rusak Berat">Rusak Berat</option>
                                </select>
                                <InputError message={errors.tingkat_kerusakan?.[0]} />
                            </div>

                            <div>
                                <Label htmlFor="kontak_pelapor">No. WhatsApp / HP</Label>
                                <Input
                                    id="kontak_pelapor"
                                    value={form.kontak_pelapor}
                                    onChange={(e) => setForm({ ...form, kontak_pelapor: e.target.value })}
                                    placeholder="081234567890"
                                />
                                <InputError message={errors.kontak_pelapor?.[0]} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi Kerusakan</Label>
                            <textarea
                                id="deskripsi"
                                value={form.deskripsi}
                                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[70px]"
                                placeholder="Jelaskan kondisi jalan, lubang, atau retakan..."
                            />
                            <InputError message={errors.deskripsi?.[0]} />
                        </div>

                        <div>
                            <Label htmlFor="foto_kerusakan">
                                {editingId === null ? 'Unggah Foto Bukti Kerusakan' : 'Ganti Foto Bukti (Opsional)'}
                            </Label>
                            <Input
                                id="foto_kerusakan"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,application/pdf"
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Format JPG/PNG/PDF, maksimal 2 MB.
                            </p>
                            {currentFileUrl && !file && (
                                <p className="text-xs text-primary mt-1">
                                    Berkas aktif: <a href={currentFileUrl} target="_blank" rel="noreferrer" className="underline">{currentFileName}</a>
                                </p>
                            )}
                            <InputError message={errors.foto_kerusakan?.[0]} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {editingId === null ? 'Kirim Laporan' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Hapus Laporan Kerusakan?"
                description={`Apakah Anda yakin ingin menghapus laporan lokasi ${deleteTarget?.lokasi_jalan}? Berkas foto juga akan dihapus dari server.`}
                onConfirm={handleDelete}
            />
        </div>
    );
}
