import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Users } from 'lucide-react';

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
  user?: {
    id: number;
    name: string;
    email: string;
  };
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
  } | null;
  users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  filters: {
    search?: string;
    status?: string;
    user_id?: string;
  };
  selectedUser?: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export default function AdminListingIndex({ listings, users, filters, selectedUser }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all');
  const [selectedUserId, setSelectedUserId] = useState<string>(filters.user_id || 'all');

  const handleMemberSelect = (userId: string) => {
    if (userId === 'all') {
      router.get(route('admin.listings.index'));
    } else {
      router.get(
        route('admin.listings.index'),
        { user_id: userId },
        { preserveState: true }
      );
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || selectedUserId === 'all') {
      return; // Don't search without a selected user
    }
    router.get(
      route('admin.listings.index'),
      { 
        search, 
        status: selectedStatus === 'all' ? '' : selectedStatus,
        user_id: selectedUserId
      },
      { preserveState: true }
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    router.get(
      route('admin.listings.index'),
      { user_id: selectedUserId },
      { preserveState: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      router.delete(route('admin.listings.destroy', id), {
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
    <AdminLayout>
      <Head title="Manage Listings" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Listing Management</h1>
            <p className="text-slate-400 mt-1">Manage business listings by member</p>
          </div>
        </div>

        {/* Member Selection - Always at Top */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Select Member</h2>
              <p className="text-sm text-slate-400">Choose a member to view and manage their listings</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                handleMemberSelect(e.target.value);
              }}
              className="flex-1 rounded-lg bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-200/20 py-3 px-4"
            >
              <option value="all">Select a member...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {selectedUserId && selectedUserId !== 'all' && (
              <button
                onClick={() => {
                  setSelectedUserId('all');
                  handleMemberSelect('all');
                }}
                className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
          
          {selectedUser && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-medium">{selectedUser.name}</div>
                  <div className="text-slate-400 text-sm">{selectedUser.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Listings Section - Only show if user is selected */}
        {selectedUserId && selectedUserId !== 'all' ? (
          listings ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700">
              {/* Search and Filter Bar */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Member Listings</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                    {listings.total} listings
                  </span>
                </div>
                
                <form onSubmit={handleSearch} className="flex gap-4">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search listings..."
                    className="flex-1 rounded-lg bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring focus:ring-blue-200/20 py-2 px-4"
                  />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring focus:ring-blue-200/20 py-2 px-4"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="sold">Sold</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                  {(search || selectedStatus !== 'all') && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>

              {/* Listings Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {listings.data.length > 0 ? (
                      listings.data.map((listing) => (
                        <tr key={listing.id} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white">
                              {listing.headline}
                            </div>
                            <div className="text-sm text-slate-400">
                              {listing.industry}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-300">{listing.listing_type}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-300">
                              {listing.city}, {listing.state}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-green-400">
                              ${listing.asking_price.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(listing.status)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm space-x-3">
                            <Link
                              href={route('listings.show', listing.id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="text-slate-400">
                            No listings found for this member.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {listings.data.length > 0 && (
                <div className="p-6 border-t border-slate-700 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing {listings.from} to {listings.to} of {listings.total} results
                  </div>
                  <div className="flex space-x-1">
                    {listings.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          link.active
                            ? 'bg-blue-600 text-white'
                            : link.url
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <div className="text-slate-400">Loading listings...</div>
            </div>
          )
        ) : (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <div className="text-slate-400 mb-2">No member selected</div>
            <div className="text-sm text-slate-500">
              Please select a member above to view and manage their listings.
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
