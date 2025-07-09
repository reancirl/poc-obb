import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Shield, ShoppingBag, ShoppingCart } from 'lucide-react';

export default function Welcome() {
  const [role, setRole] = useState<'admin' | 'seller' | 'buyer'>('admin');

  const roles = [
    { id: 'admin', label: 'Admin Portal', icon: Shield },
    { id: 'seller', label: 'Seller Portal', icon: ShoppingBag },
    { id: 'buyer', label: 'Buyer Portal', icon: ShoppingCart },
  ] as const;

  const selected = roles.find(r => r.id === role)!;

  return (
    <>
      <Head title="Welcome" />

      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8">
          Select your portal to log in
        </h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {roles.map(({ id, label, icon: Icon }) => {
            const active = role === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={`flex-1 border rounded-lg p-6 text-left transition-all duration-200 focus:outline-none ${
                  active ? 'border-black bg-gray-100' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="ml-2 font-medium text-gray-900 mr-2">
                      {label}
                    </span>
                  </div>
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
                      active ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <Link
          href={route('login', { role: selected.id })}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition"
        >
          Login as {selected.label.replace(' Portal', '')}
        </Link>
      </div>
    </>
  );
}