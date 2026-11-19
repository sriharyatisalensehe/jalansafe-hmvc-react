import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, MapPin, ShieldCheck, Users } from 'lucide-react';
import { useSharedProps } from '@/hooks/use-shared-props';

type DashboardProps = {
    totalDataJalan: number;
    totalPelaporan: number;
    totalUsers: number | null;
};

const cardClass =
    'rounded-xl border border-sidebar-border/70 p-6 transition hover:bg-accent dark:border-sidebar-border';

export default function Dashboard({ totalDataJalan, totalPelaporan, totalUsers }: DashboardProps) {
    const { user, isAdmin } = useSharedProps();

    return (
        <>
            <Head title="Dashboard - JalanSafe" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h1 className="text-xl font-semibold">Selamat datang di JalanSafe, {user.name}!</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        Anda masuk sebagai <span className="font-medium text-foreground">{isAdmin ? 'Aparatur Dinas Bina Marga (Admin)' : 'Warga Pelapor (User)'}</span>.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/datajalan" className={cardClass}>
                        <MapPin className="size-6 text-primary" />
                        <p className="mt-4 text-3xl font-bold">{totalDataJalan}</p>
                        <p className="text-sm text-muted-foreground">Master Ruas Jalan (CRUD Inertia)</p>
                    </Link>

                    <Link href="/pelaporanjalan" className={cardClass}>
                        <AlertTriangle className="size-6 text-amber-500" />
                        <p className="mt-4 text-3xl font-bold">{totalPelaporan}</p>
                        <p className="text-sm text-muted-foreground">Pelaporan Kerusakan (CRUD AJAX)</p>
                    </Link>

                    {isAdmin && totalUsers !== null && (
                        <Link href="/admin/users" className={cardClass}>
                            <Users className="size-6 text-blue-500" />
                            <p className="mt-4 text-3xl font-bold">{totalUsers}</p>
                            <p className="text-sm text-muted-foreground">Jumlah Pengguna Terdaftar</p>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
