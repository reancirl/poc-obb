import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    role: 'member';
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'member',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-5">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">Create an account</h1>
                <p className="text-gray-500 mb-6 text-center">
                    Enter your details below to create your account
                </p>

                <form className="w-full max-w-md" onSubmit={submit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>



                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="+1 (555) 123-4567"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium flex justify-center items-center"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="animate-spin w-4 h-4 mr-2" />}
                            Get started For Free
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            No credit card required
                        </p>
                    </div>
                </form>

                <p className="mt-6 text-sm text-gray-700">
                    Already have an account?{' '}
                    <TextLink href={route('login')} className="text-green-600 underline">
                        Log in
                    </TextLink>
                </p>
                
                <p className="mt-4 text-xs text-gray-400 text-center">
                    Free accounts can get up to 3 listings
                </p>
            </div>
        </>
    );
}
