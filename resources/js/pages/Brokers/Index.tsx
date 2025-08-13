import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { User, Building, MapPin, Phone, Globe } from 'lucide-react';

interface Broker {
  id: number;
  name: string;
  company_name: string;
  serving_area: string;
  bio: string | null;
  profile_photo: string | null;
  phone: string;
  website: string | null;
}

interface Props {
  brokers: {
    data: Broker[];
    links: any;
    current_page: number;
    last_page: number;
  };
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
}

export default function BrokersIndex({ brokers, auth }: Props) {
  return (
    <PublicLayout auth={auth}>
      <Head title="Business Brokers Directory" />
      
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Brokers Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with verified business brokers who can help you buy or sell your business. 
              Our premier brokers are experienced professionals ready to guide you through the process.
            </p>
          </div>
        </div>

        {/* Brokers Grid */}
        {brokers.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokers.data.map((broker) => (
              <Link key={broker.id} href={`/brokers/${broker.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                  {/* Broker Photo and Badge */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      {broker.profile_photo ? (
                        <img
                          src={broker.profile_photo}
                          alt={broker.name}
                          className="h-20 w-20 rounded-full object-cover border-3 border-gray-200"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-200 border-3 border-gray-300 flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      {/* Premier Badge */}
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Premier
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{broker.name}</h3>
                      {broker.company_name && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Building className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate font-medium">{broker.company_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Broker Info */}
                  <div className="space-y-3 mb-4">
                    {broker.serving_area && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        <span>{broker.serving_area}</span>
                      </div>
                    )}
                    
                    {broker.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{broker.phone}</span>
                      </div>
                    )}

                    {broker.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4 flex-shrink-0 text-purple-500" />
                        <span className="truncate hover:text-blue-600">{broker.website}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Bio Preview */}
                  {broker.bio && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
                        {broker.bio}
                      </p>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div 
                      className="inline-flex items-center text-sm font-medium hover:underline"
                      style={{ color: '#010079' }}
                    >
                      View Full Profile →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-12 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No brokers found.</p>
              <p className="mt-2 text-gray-400">Check back later for verified business brokers.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {brokers.data.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              {brokers.links.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 text-sm rounded-md ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                      ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
