import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

// Define the Listing type
interface Listing {
  id: number;
  headline: string;
  industry: string;
  listing_type: string;
  city: string;
  state: string;
  asking_price: number;
  status: 'draft' | 'published' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
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
  listings: {
    data: Listing[];
    links: PaginationProps['links'];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
};

export default function ListingIndex({ listings }: Props) {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('member.listings.index'),
      { search, status: selectedStatus === 'all' ? '' : selectedStatus },
      { preserveState: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      router.delete(route('member.listings.destroy', id), {
        onSuccess: () => {
          toast.success('Listing deleted successfully');
        },
        onError: (errors) => {
          toast.error('Failed to delete listing');
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout>
      <Head title="My Listings" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Business Listings</h2>
                <Link
                  href={route('member.listings.create')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring focus:ring-green-300 disabled:opacity-25 transition"
                >
                  Create New Listing
                </Link>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search listings..."
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 py-2 px-4"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="sold">Sold</option>
                    <option value="inactive">Inactive</option>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listings.data.map((listing) => (
                      <tr key={listing.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              href={route('member.listings.show', listing.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {listing.headline}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.industry}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{listing.listing_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {listing.city}, {listing.state}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${listing.asking_price.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(listing.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            href={route('member.listings.edit', listing.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="text-red-600 hover:text-red-900 ml-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {listings.data.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No listings found. Create your first listing to get started.
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{listings.from}</span> to{' '}
                    <span className="font-medium">{listings.to}</span> of{' '}
                    <span className="font-medium">{listings.total}</span> results
                  </div>
                  <div className="flex space-x-2">
                    {listings.links.map((link, index) => (
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
