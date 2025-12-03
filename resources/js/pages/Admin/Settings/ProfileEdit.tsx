import { AdminCard, AdminCardContent, AdminCardHeader, AdminCardTitle, AdminCardDescription } from '@/components/admin/admin-card';
import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { Settings, Shield } from 'lucide-react';

type ProfileForm = {
    first_name: string;
    last_name: string;
    email: string;
};

export default function AdminProfileEdit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        first_name: auth.user.first_name || '',
        last_name: auth.user.last_name || '',
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.settings.profile.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin Profile Settings" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Profile settings</h1>
                        <p className="text-slate-400">Update your admin contact details and email.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AdminCard className="lg:col-span-2">
                        <AdminCardHeader>
                            <div>
                                <AdminCardTitle>Profile information</AdminCardTitle>
                                <AdminCardDescription>Used for admin communications and alerts</AdminCardDescription>
                            </div>
                            <Shield className="h-5 w-5 text-blue-300" />
                        </AdminCardHeader>
                        <AdminCardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-2">
                                    <label htmlFor="first_name" className="text-sm text-slate-200">First name</label>
                                    <input
                                        id="first_name"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                        autoComplete="given-name"
                                    />
                                    <InputError className="mt-1" message={errors.first_name} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="last_name" className="text-sm text-slate-200">Last name</label>
                                    <input
                                        id="last_name"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                        autoComplete="family-name"
                                    />
                                    <InputError className="mt-1" message={errors.last_name} />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm text-slate-200">Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="text-sm text-slate-300">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-blue-300 underline underline-offset-4"
                                        >
                                            Resend verification email.
                                        </Link>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-400">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Save changes
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
                                <AdminCardDescription>Jump back to admin settings overview</AdminCardDescription>
                            </div>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3 text-sm">
                            <p className="text-slate-300">Need the overview instead?</p>
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
