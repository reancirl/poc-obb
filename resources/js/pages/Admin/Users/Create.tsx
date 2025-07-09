import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type Props = {
  roles: { value: string; label: string }[];
};

export default function UserCreate({ roles }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  return (
    <AppLayout>
      <Head title="Create User" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Create New User</h2>
                <Link
                  href={route('admin.users.index')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to Users
                </Link>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-4 py-2"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <Link
                    href={route('admin.users.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      processing ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {processing ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
