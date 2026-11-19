import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { UserForm } from '../components/user-form';
import type { UserFormData } from '../components/user-form';

type CreateProps = {
    roles: { value: string; label: string }[];
};

export default function Create({ roles }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<UserFormData>({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/admin/users');
    };

    return (
        <>
            <Head title="Tambah User" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Tambah User</h1>
                    <p className="text-sm text-muted-foreground">Isi data akun baru beserta role-nya.</p>
                </div>

                <UserForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    roles={roles}
                    submitLabel="Simpan"
                    setData={setData}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Kelola User', href: '/admin/users' },
        { title: 'Tambah User', href: '/admin/users/create' },
    ],
};