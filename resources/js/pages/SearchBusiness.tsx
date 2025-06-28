import { Head } from '@inertiajs/react';
import { Auth } from '@/types';

interface Props {
    auth: Auth;
    // Add any other props your component might receive
}

export default function SearchBusiness({ auth }: Props) {
    return (
        <>
            <Head title="Search Business" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search for a Business</h1>
                        
                        {/* Search Form */}
                        <div className="max-w-xl mx-auto">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Search businesses..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        
                        {/* Search results will be displayed here */}
                        <div className="mt-8">
                            {/* Add your search results component here */}
                            <p className="text-gray-500">Search results will appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
