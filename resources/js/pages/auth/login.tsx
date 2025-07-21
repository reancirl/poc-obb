import { useEffect, useState, FormEventHandler } from 'react';
import { Head, useForm, Link as InertiaLink } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

const roleLabels: Record<string, string> = {
  admin: 'Admin Portal',
  member: 'Member Portal',
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  role?: string; // Optional role passed from route
}

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login({ status, canResetPassword, role: propRole }: LoginProps) {
  const [role, setRole] = useState<string>(propRole || 'member'); // Default to member

  useEffect(() => {
    // If role is passed as prop (from hidden admin route), use it
    if (propRole && roleLabels[propRole]) {
      setRole(propRole);
      return;
    }
    
    // Otherwise check URL params
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r && roleLabels[r]) {
      setRole(r);
    } else {
      setRole('member'); // Default to member if no role specified
    }
  }, [propRole]);

  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login', { role }), { onFinish: () => reset('password') });
  };

  const isAdmin = role === 'admin';

  return (
    <>
      <Head title={`Log in${role ? ` to ${roleLabels[role]}` : ''}`} />

      <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${
        isAdmin 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
          : 'bg-white'
      }`}>
        {isAdmin && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        )}
        
        <div className={`relative z-10 w-full max-w-md ${
          isAdmin 
            ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl' 
            : ''
        }`}>
          {isAdmin && (
            <div className="flex items-center justify-center mb-8">
              <div className="p-3 bg-red-600/20 rounded-full border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          )}
          
          <h1 className={`text-2xl md:text-3xl font-semibold mb-2 text-center ${
            isAdmin ? 'text-white' : 'text-gray-900'
          }`}>
            {isAdmin ? 'Admin Portal' : `Log in${role ? ` to ${roleLabels[role]}` : ''}`}
          </h1>
          
          <p className={`mb-6 text-center ${
            isAdmin ? 'text-gray-300' : 'text-gray-500'
          }`}>
            {isAdmin 
              ? 'Secure administrative access' 
              : 'Enter your email and password below to log in'
            }
          </p>

          {isAdmin && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300 text-xs font-medium">RESTRICTED ACCESS</span>
              </div>
            </div>
          )}

          <form className="w-full" onSubmit={submit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${
                  isAdmin ? 'text-gray-200' : 'text-gray-700'
                }`}>
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
                  className={`mt-1 block w-full rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    isAdmin 
                      ? 'bg-slate-700/50 border border-slate-600 text-white focus:ring-red-500 focus:border-red-500' 
                      : 'border border-gray-300 focus:ring-black'
                  }`}
                />
                <InputError message={errors.email} className="mt-1" />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className={`block text-sm font-medium ${
                    isAdmin ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  {canResetPassword && !isAdmin && (
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
                  className={`mt-1 block w-full rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    isAdmin 
                      ? 'bg-slate-700/50 border border-slate-600 text-white focus:ring-red-500 focus:border-red-500' 
                      : 'border border-gray-300 focus:ring-black'
                  }`}
                />
                <InputError message={errors.password} className="mt-1" />
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onClick={() => setData('remember', !data.remember)}
                  className={`h-4 w-4 ${
                    isAdmin ? 'text-red-600' : 'text-black'
                  }`}
                />
                <label htmlFor="remember" className={`ml-2 text-sm ${
                  isAdmin ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-sm font-medium flex justify-center items-center transition-colors ${
                  isAdmin 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={processing}
              >
                {processing && <LoaderCircle className="animate-spin w-4 h-4 mr-2" />}
                {isAdmin ? 'Access Admin Portal' : 'Log in'}
              </button>
            </div>
          </form>

          {!isAdmin && (
            <p className="mt-6 text-sm text-gray-700 text-center">
              Don't have an account?{' '}
              <TextLink href={route('register')} className="text-green-600 underline">
                Sign up
              </TextLink>
            </p>
          )}

          {status && (
            <div className={`mt-4 text-center text-sm font-medium ${
              isAdmin ? 'text-red-400' : 'text-green-600'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </>
  );
}