import { usePage } from '@inertiajs/react';

export function useSharedProps() {
    const { auth, flash } = usePage().props;

    return {
        user: auth.user,
        isAdmin: auth.user?.role === 'admin',
        flash,
    };
}