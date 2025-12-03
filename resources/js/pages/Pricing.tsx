import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/layouts/public-layout";
import { CheckCircle2, Star } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  frequency: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
  accent?: string;
  sublabel?: string;
};

type AddOn = {
  name: string;
  price: string;
  description: string;
};

interface Props {
  auth: {
    user: {
      id: number;
      role: string;
    } | null;
  };
}

const brokerPlans: Plan[] = [
  {
    name: "Broker Basic",
    price: "$99",
    frequency: "/month",
    features: [
      "Up to 10 active listings",
      "Standard search placement",
      "Broker profile page",
      "Basic analytics",
    ],
    ctaText: "Get Started",
    ctaHref: "/register",
    accent: "border-gray-200",
  },
  {
    name: "Broker Pro",
    price: "$249",
    frequency: "/month",
    features: [
      "Unlimited listings",
      "Priority search placement",
      "Featured broker directory profile",
      "Advanced analytics and buyer demographics",
      "Photo and video uploads",
      "Option for Featured Listing add-ons",
    ],
    ctaText: "Upgrade to Pro",
    ctaHref: "/register",
    highlight: true,
    badge: "Most Popular",
    accent: "border-[#010079]",
  },
  {
    name: "Broker Enterprise",
    price: "$499",
    frequency: "/month",
    features: [
      "Everything in Pro",
      "10 free Featured Listings monthly",
      "Exclusive lead routing",
      "CRM and website integration (API/white-label)",
      "Dedicated account manager",
    ],
    ctaText: "Go Enterprise",
    ctaHref: "/contact",
    accent: "border-gray-200",
  },
];

const sellerPlans: Plan[] = [
  {
    name: "DIY Seller",
    price: "$299",
    frequency: "one-time",
    sublabel: "6 months live",
    features: [
      "One listing (6 months)",
      "Up to 10 photos",
      "Buyers contact you directly",
    ],
    ctaText: "List My Business",
    ctaHref: "/sell-a-business",
  },
  {
    name: "Premium Seller",
    price: "$499",
    frequency: "one-time",
    sublabel: "6 months live",
    features: [
      "All DIY features",
      "Premium placement",
      "Homepage exposure",
      "Valuation tool access",
      "Email blast to buyers",
    ],
    ctaText: "Go Premium",
    ctaHref: "/sell-a-business",
    highlight: true,
    badge: "Highlighted placement",
  },
];

const addOns: AddOn[] = [
  {
    name: "Featured Listing",
    price: "$99/mo",
    description: "Pin to the top of search results",
  },
  {
    name: "Buyer Leads Subscription",
    price: "$49/mo",
    description: "Unlock buyer details and alerts",
  },
  {
    name: "Valuation Report",
    price: "$99 one-time",
    description: "Instant business valuation range",
  },
];

export default function Pricing({ auth }: Props) {
  return (
    <PublicLayout auth={auth}>
      <Head title="Pricing" />
      <div className="bg-gray-50">
        <section className="bg-white pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#010079] bg-blue-50 px-4 py-2 rounded-full">
              <Star className="h-4 w-4 text-[#010079]" /> Plans for brokers and sellers
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
              Transparent pricing built for growth
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your brokerage or selling needs. Upgrade anytime and add
              high-visibility options when you are ready.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="#broker-plans"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-semibold shadow-sm"
                style={{ backgroundColor: "#010079" }}
              >
                View Broker Plans
              </Link>
              <Link
                href="#seller-plans"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 text-gray-800 font-semibold bg-white hover:bg-gray-100"
              >
                View Seller Plans
              </Link>
            </div>
          </div>
        </section>

        <section id="broker-plans" className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-[#010079] uppercase tracking-wide">
                Broker Plans
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Start lean or scale with priority placement
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brokerPlans.map((plan) => {
              const borderClass = plan.highlight ? plan.accent || "border-[#010079]" : "border-gray-200";
              return (
                <div
                  key={plan.name}
                  className={`relative bg-white border ${borderClass} rounded-xl shadow-sm hover:shadow-md transition-shadow`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-4 rounded-full bg-yellow-400 text-xs font-bold px-3 py-1 text-gray-900 shadow">
                      {plan.badge}
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-500">{plan.frequency}</span>
                    </div>
                    {plan.sublabel && (
                      <p className="text-sm text-gray-500 mt-1">{plan.sublabel}</p>
                    )}
                    <ul className="mt-5 space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.ctaHref}
                      className={`mt-6 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold ${
                        plan.highlight
                          ? "text-white shadow-sm"
                          : "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
                      }`}
                      style={plan.highlight ? { backgroundColor: "#010079" } : undefined}
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="seller-plans" className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-[#010079] uppercase tracking-wide">
                Seller Plans
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                For owners ready to list and attract buyers
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white border ${
                  plan.highlight ? "border-[#010079]" : "border-gray-200"
                } rounded-xl shadow-sm hover:shadow-md transition-shadow`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-4 rounded-full bg-blue-100 text-xs font-bold px-3 py-1 text-[#010079] shadow">
                    {plan.badge}
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.frequency}</span>
                  </div>
                  {plan.sublabel && (
                    <p className="text-sm text-gray-500 mt-1">{plan.sublabel}</p>
                  )}
                  <ul className="mt-5 space-y-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.ctaHref}
                    className={`mt-6 inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold ${
                      plan.highlight
                        ? "text-white shadow-sm"
                        : "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100"
                    }`}
                    style={plan.highlight ? { backgroundColor: "#010079" } : undefined}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#010079] uppercase tracking-wide">
                Add-Ons
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Boost visibility and insights
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{addon.name}</h3>
                  <span className="text-sm font-bold text-[#010079]">{addon.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
