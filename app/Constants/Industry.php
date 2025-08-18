<?php

declare(strict_types=1);

namespace App\Constants;

/**
 * Canonical list of industries and subcategories for use across the app.
 *
 * - Slugs are kebab-case and stable.
 * - Labels mirror the UI copy you shared.
 * - Helper methods make it easy to populate selects, validate inputs, etc.
 */
final class Industry
{
    private function __construct() {}

    // =============================
    // Parent industry slugs
    // =============================
    public const AGRICULTURE = 'agriculture';
    public const AUTOMOTIVE_AND_BOAT = 'automotive-boat';
    public const BEAUTY_AND_PERSONAL_CARE = 'beauty-personal-care';
    public const BUILDING_AND_CONSTRUCTION = 'building-construction';
    public const COMMUNICATION_AND_MEDIA = 'communication-media';
    public const EDUCATION_AND_CHILDREN = 'education-children';
    public const ENTERTAINMENT_AND_RECREATION = 'entertainment-recreation';
    public const FINANCIAL_SERVICES = 'financial-services';
    public const HEALTH_CARE_AND_FITNESS = 'health-care-fitness';
    public const MANUFACTURING = 'manufacturing';
    public const NON_CLASSIFIABLE_ESTABLISHMENTS = 'non-classifiable-establishments';
    public const ONLINE_AND_TECHNOLOGY = 'online-technology';
    public const PET_SERVICES = 'pet-services';
    public const RESTAURANTS_AND_FOOD = 'restaurants-food';
    public const RETAIL = 'retail';
    public const SERVICE_BUSINESSES = 'service-businesses';
    public const TRANSPORTATION_AND_STORAGE = 'transportation-storage';
    public const TRAVEL = 'travel';
    public const WHOLESALE_AND_DISTRIBUTORS = 'wholesale-distributors';

    /** @var array<string,string> map of parent slug => label */
    public const PARENTS = [
        self::AGRICULTURE => 'Agriculture',
        self::AUTOMOTIVE_AND_BOAT => 'Automotive & Boat',
        self::BEAUTY_AND_PERSONAL_CARE => 'Beauty & Personal Care',
        self::BUILDING_AND_CONSTRUCTION => 'Building & Construction',
        self::COMMUNICATION_AND_MEDIA => 'Communication & Media',
        self::EDUCATION_AND_CHILDREN => 'Education & Children',
        self::ENTERTAINMENT_AND_RECREATION => 'Entertainment & Recreation',
        self::FINANCIAL_SERVICES => 'Financial Services',
        self::HEALTH_CARE_AND_FITNESS => 'Health Care & Fitness',
        self::MANUFACTURING => 'Manufacturing',
        self::NON_CLASSIFIABLE_ESTABLISHMENTS => 'Non-Classifiable Establishments',
        self::ONLINE_AND_TECHNOLOGY => 'Online & Technology',
        self::PET_SERVICES => 'Pet Services',
        self::RESTAURANTS_AND_FOOD => 'Restaurants & Food',
        self::RETAIL => 'Retail',
        self::SERVICE_BUSINESSES => 'Service Businesses',
        self::TRANSPORTATION_AND_STORAGE => 'Transportation & Storage',
        self::TRAVEL => 'Travel',
        self::WHOLESALE_AND_DISTRIBUTORS => 'Wholesale & Distributors',
    ];

    /**
     * CHILDREN: map of parent slug => (child slug => child label)
     * @var array<string, array<string,string>>
     */
    public const CHILDREN = [
        self::AGRICULTURE => [
            'greenhouses' => 'Greenhouses',
            'tree-farms-orchards' => 'Tree Farms & Orchards',
            'vineyards-wineries' => 'Vineyards & Wineries',
            'other-agriculture' => 'Other Agriculture',
        ],
        self::AUTOMOTIVE_AND_BOAT => [
            'auto-repair-service-shops' => 'Auto Repair & Service Shops',
            'car-dealerships' => 'Car Dealerships',
            'car-washes' => 'Car Washes',
            'equipment-rental-dealers' => 'Equipment Rental & Dealers',
            'gas-stations' => 'Gas Stations',
            'junk-salvage-yards' => 'Junk & Salvage Yards',
            'marine-boat-service-dealers' => 'Marine/Boat Service & Dealers',
            'towing-companies' => 'Towing Companies',
            'truck-stops' => 'Truck Stops',
            'other-automotive-boat' => 'Other Automotive & Boat',
        ],
        self::BEAUTY_AND_PERSONAL_CARE => [
            'hair-salons-barber-shops' => 'Hair Salons & Barber Shops',
            'massage' => 'Massage',
            'nail-salons' => 'Nail Salons',
            'spas' => 'Spas',
            'tanning-salons' => 'Tanning Salons',
            'other-beauty-personal-care' => 'Other Beauty & Personal Care',
        ],
        self::BUILDING_AND_CONSTRUCTION => [
            'building-material-hardware-stores' => 'Building Material & Hardware Stores',
            'concrete' => 'Concrete',
            'electrical-mechanical' => 'Electrical & Mechanical',
            'heavy-construction' => 'Heavy Construction',
            'hvac-businesses' => 'HVAC Businesses',
            'plumbing' => 'Plumbing',
            'other-building-construction' => 'Other Building & Construction',
        ],
        self::COMMUNICATION_AND_MEDIA => [
            'magazines-newspapers' => 'Magazines & Newspapers',
            'production-companies' => 'Production Companies',
            'other-communication-media' => 'Other Communication & Media',
        ],
        self::EDUCATION_AND_CHILDREN => [
            'day-care-child-care-centers' => 'Day Care & Child Care Centers',
            'preschools' => 'Preschools',
            'schools' => 'Schools',
            'other-education-children' => 'Other Education & Children',
        ],
        self::ENTERTAINMENT_AND_RECREATION => [
            'art-galleries' => 'Art Galleries',
            'banquet-halls' => 'Banquet Halls',
            'bowling-alleys' => 'Bowling Alleys',
            'casinos' => 'Casinos',
            'golf-courses-services' => 'Golf Courses & Services',
            'marinas-fishing' => 'Marinas & Fishing',
            'nightclubs-theaters' => 'Nightclubs & Theaters',
            'other-entertainment-recreation' => 'Other Entertainment & Recreation',
        ],
        self::FINANCIAL_SERVICES => [
            'accounting-tax-practices' => 'Accounting & Tax Practices',
            'banking-loans' => 'Banking & Loans',
            'check-cashing' => 'Check Cashing',
            'insurance-agencies' => 'Insurance Agencies',
            'other-financial-services' => 'Other Financial Services',
        ],
        self::HEALTH_CARE_AND_FITNESS => [
            'assisted-living-nursing-homes' => 'Assisted Living & Nursing Homes',
            'dance-pilates-yoga' => 'Dance, Pilates & Yoga',
            'dental-practices' => 'Dental Practices',
            'gyms-fitness-centers' => 'Gyms & Fitness Centers',
            'home-health-care' => 'Home Health Care',
            'medical-practices' => 'Medical Practices',
            'other-health-care-fitness' => 'Other Health Care & Fitness',
        ],
        self::MANUFACTURING => [
            'auto-boat-aircraft' => 'Auto, Boat & Aircraft',
            'chemical-related-products' => 'Chemical & Related products',
            'clothing-fabric' => 'Clothing & Fabric',
            'electronic-electrical-equipment' => 'Electronic & Electrical Equipment',
            'energy-petroleum' => 'Energy & Petroleum',
            'food-related-products' => 'Food & Related products',
            'furniture-fixtures' => 'Furniture & Fixtures',
            'glass-stone-concrete' => 'Glass, Stone & Concrete',
            'industrial-commercial-machinery' => 'Industrial & Commercial Machinery',
            'lumber-wood-products' => 'Lumber & Wood Products',
            'machine-shops-tools' => 'Machine Shops & Tools',
            'medical-devices-products' => 'Medical Devices & Products',
            'metal-products' => 'Metal Products',
            'mining' => 'Mining',
            'packaging' => 'Packaging',
            'paper-printing' => 'Paper & Printing',
            'rubber-plastic-products' => 'Rubber & Plastic Products',
            'signs' => 'Signs',
            'other-manufacturing' => 'Other Manufacturing',
        ],
        self::NON_CLASSIFIABLE_ESTABLISHMENTS => [
            'all-non-classifiable-establishments' => 'All Non-Classifiable Establishments',
        ],
        self::ONLINE_AND_TECHNOLOGY => [
            'cell-phone-computer-repair-services' => 'Cell Phone & Computer Repair & Services',
            'graphic-web-design' => 'Graphic & Web Design',
            'it-software-services' => 'IT & Software Services',
            'software-app-companies' => 'Software & App Companies',
            'websites-ecommerce' => 'Websites & Ecommerce',
            'other-online-technology' => 'Other Online & Technology',
        ],
        self::PET_SERVICES => [
            'dog-daycare-boarding' => 'Dog Daycare & Boarding',
            'pet-grooming' => 'Pet Grooming',
            'pet-stores-supplies' => 'Pet Stores & Supplies',
            'other-pet-services' => 'Other Pet Services',
        ],
        self::RESTAURANTS_AND_FOOD => [
            'american-restaurants' => 'American Restaurants',
            'bakeries' => 'Bakeries',
            'bars-pubs-taverns' => 'Bars, Pubs & Taverns',
            'breweries' => 'Breweries',
            'chinese-restaurants' => 'Chinese Restaurants',
            'coffee-shops-cafes' => 'Coffee Shops & Cafes',
            'delis-sandwich-shops' => 'Delis & Sandwich Shops',
            'diners' => 'Diners',
            'donut-shops' => 'Donut Shops',
            'food-trucks' => 'Food Trucks',
            'ice-cream-frozen-yogurt-shops' => 'Ice Cream & Frozen Yogurt Shops',
            'indian-restaurants' => 'Indian Restaurants',
            'italian-restaurants' => 'Italian Restaurants',
            'juice-bars' => 'Juice Bars',
            'mexican-restaurants' => 'Mexican Restaurants',
            'miscellaneous-restaurant-bars' => 'Miscellaneous Restaurant & Bars',
            'pizza-restaurants' => 'Pizza Restaurants',
            'sushi-japanese-restaurants' => 'Sushi & Japanese Restaurants',
            'thai-restaurants' => 'Thai Restaurants',
            'other-restaurants-food' => 'Other Restaurants & Food',
        ],
        self::RETAIL => [
            'bike-shops' => 'Bike Shops',
            'clothing-accessory-stores' => 'Clothing & Accessory Stores',
            'convenience-stores' => 'Convenience Stores',
            'dollar-stores' => 'Dollar Stores',
            'flower-shops' => 'Flower Shops',
            'furniture-furnishings-stores' => 'Furniture & Furnishings Stores',
            'grocery-stores-supermarkets' => 'Grocery Stores & Supermarkets',
            'health-food-nutrition' => 'Health Food & Nutrition',
            'jewelry-stores' => 'Jewelry Stores',
            'liquor-stores' => 'Liquor Stores',
            'nursery-garden-centers' => 'Nursery & Garden Centers',
            'pawn-shops' => 'Pawn Shops',
            'pharmacies' => 'Pharmacies',
            'smoke-shops' => 'Smoke Shops',
            'vending-machines' => 'Vending Machines',
            'other-retail' => 'Other Retail',
        ],
        self::SERVICE_BUSINESSES => [
            'architecture-engineering-firms' => 'Architecture & Engineering Firms',
            'catering-companies' => 'Catering Companies',
            'cleaning-businesses' => 'Cleaning Businesses',
            'commercial-laundry' => 'Commercial Laundry',
            'dry-cleaners' => 'Dry Cleaners',
            'funeral-homes' => 'Funeral Homes',
            'landscaping-yard-services' => 'Landscaping & Yard Services',
            'laundromats-coin-laundry' => 'Laundromats & Coin Laundry',
            'legal-services-law-firms' => 'Legal Services & Law Firms',
            'locksmith' => 'Locksmith',
            'medical-billing' => 'Medical Billing',
            'mobile-home-parks' => 'Mobile Home Parks',
            'pest-control' => 'Pest Control',
            'property-management' => 'Property Management',
            'routes' => 'Routes',
            'security' => 'Security',
            'staffing-agencies' => 'Staffing Agencies',
            'waste-management-recycling' => 'Waste Management & Recycling',
            'other-service-businesses' => 'Other Service Businesses',
        ],
        self::TRANSPORTATION_AND_STORAGE => [
            'limo-passenger-transportation' => 'Limo & Passenger Transportation',
            'moving-shipping' => 'Moving & Shipping',
            'storage-facilities-warehouses' => 'Storage Facilities & Warehouses',
            'trucking-companies' => 'Trucking Companies',
            'other-transportation-storage' => 'Other Transportation & Storage',
        ],
        self::TRAVEL => [
            'bed-breakfasts' => 'Bed & Breakfasts',
            'campgrounds-rv-parks' => 'Campgrounds & RV Parks',
            'hotels' => 'Hotels',
            'motels' => 'Motels',
            'travel-agencies' => 'Travel Agencies',
            'other-travel' => 'Other Travel',
        ],
        self::WHOLESALE_AND_DISTRIBUTORS => [
            'durable-goods' => 'Durable Goods',
            'nondurable-goods' => 'Nondurable Goods',
            'other-wholesalers-distributors' => 'Other Wholesalers & Distributors',
        ],
    ];

    // =============================
    // Helpers
    // =============================

    /** @return list<string> Parent slugs */
    public static function parents(): array
    {
        return array_keys(self::PARENTS);
    }

    /** @return array<string,string> Parent slug => label */
    public static function parentLabels(): array
    {
        return self::PARENTS;
    }

    /** @return array<string,string> Child slug => label */
    public static function childrenOf(string $parentSlug): array
    {
        return self::CHILDREN[$parentSlug] ?? [];
    }

    /** Find the parent slug for a given child slug */
    public static function parentOfChild(string $childSlug): ?string
    {
        foreach (self::CHILDREN as $parent => $children) {
            if (isset($children[$childSlug])) {
                return $parent;
            }
        }
        return null;
    }

    /** Is this a valid parent slug? */
    public static function isValidParent(string $parentSlug): bool
    {
        return isset(self::PARENTS[$parentSlug]);
    }

    /** Is this a valid child slug (in any parent)? */
    public static function isValidChild(string $childSlug): bool
    {
        foreach (self::CHILDREN as $children) {
            if (isset($children[$childSlug])) {
                return true;
            }
        }
        return false;
    }

    /** Get the human label for either a parent or child slug */
    public static function labelFor(string $slug): ?string
    {
        if (isset(self::PARENTS[$slug])) {
            return self::PARENTS[$slug];
        }
        foreach (self::CHILDREN as $children) {
            if (isset($children[$slug])) {
                return $children[$slug];
            }
        }
        return null;
    }

    /**
     * Build grouped options for a select component
     * [
     *   ['value' => 'agriculture', 'label' => 'Agriculture', 'children' => [ ['value' => 'greenhouses', 'label' => 'Greenhouses'], ... ]],
     *   ...
     * ]
     * @return array<int, array{value:string,label:string,children:array<int,array{value:string,label:string}>}>
     */
    public static function toGroupedOptions(): array
    {
        $options = [];
        foreach (self::PARENTS as $parentSlug => $parentLabel) {
            $childOptions = [];
            foreach (self::childrenOf($parentSlug) as $childSlug => $childLabel) {
                $childOptions[] = ['value' => $childSlug, 'label' => $childLabel];
            }
            $options[] = [
                'value' => $parentSlug,
                'label' => $parentLabel,
                'children' => $childOptions,
            ];
        }
        return $options;
    }

    /** Flatten all child slugs */
    public static function allChildSlugs(): array
    {
        $all = [];
        foreach (self::CHILDREN as $children) {
            $all = array_merge($all, array_keys($children));
        }
        sort($all);
        return $all;
    }
}
