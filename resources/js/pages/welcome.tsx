import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Welcome" />

      {/* Page Container */}
      <div className="flex flex-col min-h-screen">

        {/* Header */}
        <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex space-x-6 text-sm font-medium text-gray-700">
              <Link href={route('search-business')} className="hover:text-gray-900">Search a Business</Link>
              <Link href="#" className="hover:text-gray-900">Buy a Business</Link>
              <Link href="#" className="hover:text-gray-900">Sell a Business</Link>
              <Link href="#" className="hover:text-gray-900">Resources</Link>
              <Link href="#" className="hover:text-gray-900">Industries</Link>
            </div>
            <div className="flex space-x-4 text-sm font-medium text-gray-700">
              {auth.user ? (
                <Link href={route('dashboard')} className="hover:text-gray-900">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href={route('login')} className="hover:text-gray-900">
                    Log in
                  </Link>
                  <Link href={route('register')} className="hover:text-gray-900">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <div
          className="relative h-screen flex flex-col justify-center items-center pt-16 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/home-hero-1.webp)` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30" />

          {/* Content */}
          <div className="relative z-10 container mx-auto text-white text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-8">
              Find a business for sale
            </h1>

            <form
              method="GET"
              className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full bg-white bg-opacity-90 placeholder-gray-500 text-gray-900 rounded-lg border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 px-4 py-3 transition"
              />
              <select
                name="industry"
                className="w-full bg-white bg-opacity-90 placeholder-gray-500 text-gray-900 rounded-lg border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-200 px-4 py-3 transition"
              >
                <option value="">All Industries</option>
              </select>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-3 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}