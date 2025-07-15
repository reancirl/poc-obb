import React from 'react';
import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

interface FeatureInDevelopmentProps {
  featureName?: string;
  returnUrl?: string;
}

export default function FeatureInDevelopment({ featureName = 'This feature', returnUrl = '/dashboard' }: FeatureInDevelopmentProps) {
  return (
    <>
      <Head title="Feature in Development" />
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <Construction className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Under Construction</h2>
            
            <p className="mt-2 text-lg text-gray-600">
              {featureName} is currently in development.
            </p>
            
            <p className="mt-4 text-sm text-gray-500">
              We're working hard to bring you this feature. Please check back soon!
            </p>
          </div>
          
          <div className="mt-8">
            <a 
              href={returnUrl}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
