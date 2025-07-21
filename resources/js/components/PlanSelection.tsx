import React from 'react';

interface PlanSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PlanSelection({ onNext, onBack }: PlanSelectionProps) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 'Free',
      features: [
        'Single Photo and No Video',
        'View Stats and Leads Online',
        'Free Valuation Report'
      ],
      popular: false
    },
    {
      id: 'showcase',
      name: 'Showcase Listing',
      price: 'Coming Soon',
      features: [
        '2X More Exposure',
        'Up to 6 Photos and 1 Video',
        'View Stats and Leads Online',
        'Free Valuation Report',
        'Contact List of Buyers',
        '1 Targeted Email Blast',
        'Appears above Basic Listings'
      ],
      popular: true
    },
    {
      id: 'diamond',
      name: 'Diamond Listing',
      price: 'Coming Soon',
      features: [
        '10X More Exposure',
        'Unlimited Photos and 2 Videos',
        'View Stats and Leads Online',
        'Free Valuation Report',
        'Contact List of Buyers',
        'Monthly Targeted Email Blast',
        'Appears at Top in Search',
        '3x Larger than Basic Listing'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 py-5">Choose how your listing will appear on our network</h2>
        <p className="text-gray-600">
          In the next step you will be able to add additional details and you will also have access to a Valuation Report to help set the right asking price. See the{' '}
          <a href="#" className="text-blue-600 underline">different sizes for listings</a>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
              ${plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                // For now, just proceed to next step regardless of selection
                onNext();
              }}
              className={`
                w-full py-2 px-4 rounded font-medium transition-colors
                ${plan.id === 'basic' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              disabled={plan.id !== 'basic'}
            >
              {plan.id === 'basic' ? 'Select Plan' : 'Coming Soon'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        <p>Free accounts can get up to 3 listings</p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue with Basic Plan
        </button>
      </div>
    </div>
  );
}
