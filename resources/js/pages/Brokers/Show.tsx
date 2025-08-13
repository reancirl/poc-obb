import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { User, Building, MapPin, Phone, Globe, Award, Calendar, Mail, Crown } from 'lucide-react';

interface Broker {
  id: number;
  name: string;
  email: string;
  company_name: string;
  serving_area: string;
  bio: string | null;
  profile_photo: string | null;
  phone: string;
  website: string | null;
  license_number: string | null;
  license_state: string | null;
  broker_upgraded_at: string;
}

interface Props {
  broker: Broker;
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
}

export default function BrokerShow({ broker, auth }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PublicLayout auth={auth}>
      <Head title={`${broker.name} - Business Broker`} />
      
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        {/* Broker Profile Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              {broker.profile_photo ? (
                <img
                  src={broker.profile_photo}
                  alt={broker.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {/* Premier Badge */}
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Premier
              </div>
            </div>

            {/* Broker Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{broker.name}</h1>
                <div className="flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Verified Broker
                </div>
              </div>

              {broker.company_name && (
                <div className="flex items-center gap-2 text-lg text-gray-700 mb-2">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold">{broker.company_name}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Serving: {broker.serving_area}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Broker since: {formatDate(broker.broker_upgraded_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Phone</p>
                <p className="font-medium text-gray-900">
                  <a href={`tel:${broker.phone}`} className="hover:text-blue-600">
                    {broker.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  <a href={`mailto:${broker.email}`} className="hover:text-blue-600">
                    {broker.email}
                  </a>
                </p>
              </div>
            </div>

            {broker.website && (
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="font-medium text-gray-900">
                    <a 
                      href={broker.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 underline"
                    >
                      {broker.website}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Bio */}
        {broker.bio && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About {broker.name}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {broker.bio}
              </p>
            </div>
          </div>
        )}

        {/* License Information */}
        {(broker.license_number || broker.license_state) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">License Information</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Professional License</p>
                <p className="font-medium text-gray-900">
                  {broker.license_number && `#${broker.license_number}`}
                  {broker.license_number && broker.license_state && ' - '}
                  {broker.license_state}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Work with {broker.name}?</h3>
          <p className="text-gray-600 mb-4">
            Get in touch to discuss your business buying or selling needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${broker.phone}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </a>
            <a
              href={`mailto:${broker.email}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
