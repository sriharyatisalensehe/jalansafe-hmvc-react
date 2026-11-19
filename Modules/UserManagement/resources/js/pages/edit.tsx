import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { UserForm } from '../components/user-form';
import type { UserFormData } from '../components/user-form';

type EditProps = {
    user: { id: number; name: string; email: string; role: string };
    roles: { value: string; label: string }[];
};

export default function Edit({ user, roles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<UserFormData>({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <>
            <Head title="Edit User" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Edit User</h1>
                    <p className="text-sm text-muted-foreground">Perbarui data akun {user.name}.</p>
                </div>

                <UserForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    roles={roles}
                    isEdit
                    submitLabel="Simpan Perubahan"
                    setData={setData}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Kelola User', href: '/admin/users' },
        { title: 'Edit User', href: '/admin/users' },
    ],
};