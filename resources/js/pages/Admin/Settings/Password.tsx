import AdminLayout from '@/layouts/admin-layout';
import { AdminCard, AdminCardContent, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/admin-card';
import { Head, useForm, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputError from '@/components/input-error';
import { FormEventHandler, useRef } from 'react';
import { Lock, Shield } from 'lucide-react';

export default function AdminPassword() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.settings.password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Password Settings" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Update password</h1>
                    <p className="text-slate-400">Use a strong, unique password to keep the admin portal secure.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Password</AdminCardTitle>
                                <AdminCardDescription>Rotate credentials regularly for security</AdminCardDescription>
                            </div>
                            <Lock className="h-5 w-5 text-blue-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <form onSubmit={updatePassword} className="space-y-6">
                                <div className="grid gap-2">
                                    <label htmlFor="current_password" className="text-sm text-slate-200">Current password</label>
                                    <input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type="password"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm text-slate-200">New password</label>
                                    <input
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        autoComplete="new-password"
                                        placeholder="New password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="password_confirmation" className="text-sm text-slate-200">Confirm password</label>
                                    <input
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Save password
                                    </button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-slate-300">Saved</p>
                                    </Transition>
                                </div>
                            </form>
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Admin profile</AdminCardTitle>
                                <AdminCardDescription>Back to admin settings overview</AdminCardDescription>
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3 text-sm">
                            <p className="text-slate-300">Need profile details instead?</p>
                            <Link
                                href={route('admin.settings.profile')}
                                className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-semibold"
                            >
                                <Shield className="h-4 w-4" />
                                Back to admin settings
                            </Link>
                        </AdminCardContent>
                    </AdminCard>
                </div>
            </div>
        </AdminLayout>
    );
}
