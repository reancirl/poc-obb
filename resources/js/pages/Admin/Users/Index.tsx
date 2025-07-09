import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  created_at: string;
  suspended_at: string | null;
}

// Define the Pagination type
interface PaginationProps {
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

type Props = {
  users: {
    data: User[];
    links: PaginationProps['links'];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
};

export default function UserIndex({ users }: Props) {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('admin.users.index'),
      { search, role: selectedRole === 'all' ? '' : selectedRole },
      { preserveState: true }
    );
  };

  interface ApiResponse {
    message: string;
  }

  interface ErrorResponse {
    response?: {
      data?: {
        message?: string;
      };
      status?: number;
    };
    message?: string;
  }

  const handleSuspendUser = (userId: number, isSuspended: boolean) => {
    if (confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this user?`)) {
      const url = isSuspended 
        ? route('admin.users.unsuspend', userId)
        : route('admin.users.suspend', userId);
      
      // Set the Accept header to application/json
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      };
      
      // Include CSRF token in the request data
      const data = {
        _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      };
      
      router.post(url, data, {
        headers,
        onSuccess: (response: any) => {
          const message = response?.data?.message || `User has been ${isSuspended ? 'unsuspended' : 'suspended'} successfully.`;
          toast.success(message);
          // Refresh the page to show the updated status
          router.reload({ only: ['users'] });
        },
        onError: (errors: ErrorResponse | string) => {
          if (typeof errors === 'object') {
            if (errors.response?.data?.message) {
              // Handle JSON error response
              toast.error(errors.response.data.message);
            } else if (errors.message) {
              // Handle other error objects with message property
              toast.error(errors.message);
            } else {
              toast.error('An error occurred while processing your request.');
            }
          } else if (typeof errors === 'string') {
            // Handle string error messages
            toast.error(errors);
          } else {
            // Fallback for any other error type
            toast.error('An unknown error occurred.');
          }
        }
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Users" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">User Management</h2>
                <Link
                  href={route('admin.users.create')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring focus:ring-green-300 disabled:opacity-25 transition"
                >
                  Add New User
                </Link>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-2 px-4"
                    />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.data.map((user: User) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`text-sm font-medium ${user.suspended_at ? 'text-gray-400' : 'text-gray-900'}`}>
                              {user.name}
                              {user.suspended_at && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  Suspended
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${user.suspended_at ? 'text-gray-400' : 'text-gray-900'}`}>
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.suspended_at 
                              ? 'bg-gray-100 text-gray-800' 
                              : user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'seller' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            {user.suspended_at && ' (Suspended)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            href={route('admin.users.edit', user.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          {user.suspended_at ? (
                            <button
                              onClick={() => handleSuspendUser(user.id, true)}
                              className="text-green-600 hover:text-green-900 ml-2"
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendUser(user.id, false)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{users.from}</span> to{' '}
                    <span className="font-medium">{users.to}</span> of{' '}
                    <span className="font-medium">{users.total}</span> results
                  </div>
                  <div className="flex space-x-2">
                    {users.links.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url || link.active}
                        className={`px-3 py-1 rounded-md ${
                          link.active
                            ? 'bg-green-600 text-white'
                            : link.url
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
