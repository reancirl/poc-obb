import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link as InertiaLink } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

const roleLabels: Record<string, string> = {
  admin: 'Admin Portal',
  seller: 'Seller Portal',
  buyer: 'Buyer Portal',
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r && roleLabels[r]) setRole(r);
  }, []);

  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login', { role }), { onFinish: () => reset('password') });
  };

  return (
    <>
      <Head title={`Log in${role ? ` to ${roleLabels[role]}` : ''}`} />

      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
          Log in{role ? ` to ${roleLabels[role]}` : ''}
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Enter your email and password below to log in
        </p>

        {role && (
          <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-6">
            {roleLabels[role]}
          </span>
        )}

        <form className="w-full max-w-md" onSubmit={submit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="email@example.com"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <InputError message={errors.email} className="mt-1" />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {canResetPassword && (
                  <TextLink href={route('password.request')} className="text-sm">
                    Forgot password?
                  </TextLink>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Password"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <InputError message={errors.password} className="mt-1" />
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={data.remember}
                onClick={() => setData('remember', !data.remember)}
                className="h-4 w-4 text-black"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium flex justify-center items-center"
              disabled={processing}
            >
              {processing && <LoaderCircle className="animate-spin w-4 h-4 mr-2" />}
              Log in
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-700">
          Don't have an account?{' '}
          <TextLink href={route('register')} className="text-green-600 underline">
            Sign up
          </TextLink>
        </p>

        {status && (
          <div className="mt-4 text-center text-sm font-medium text-green-600">
            {status}
          </div>
        )}
      </div>
    </>
  );
}