import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';


interface Props {
  children: ReactNode;
}

interface Props {
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
}

export default function PublicLayout({ children, auth }: Props) {
  return (  
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900">Business Listings</h1> */}
            {/* <p className="mt-2 text-gray-600">Browse our available businesses for sale</p> */}
          </div>
          <div className="flex space-x-2 pt-10">
            <Link
              href={auth?.user ? route('dashboard') : route('login')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010079]"
              style={{ '--tw-ring-color': '#010079' } as React.CSSProperties}
            >
              {auth?.user ? 'View Dashboard' : 'Sign In'}
            </Link>
            {!auth?.user && (
              <Link
                href={route('register')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010079]"
                style={{ backgroundColor: '#010079', '--tw-ring-color': '#010079' } as React.CSSProperties}
              >
                Join
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
