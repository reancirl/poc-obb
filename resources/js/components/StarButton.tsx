import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';

interface StarButtonProps {
  listingId: number;
  initialIsStarred: boolean;
  className?: string;
  showCount?: boolean;
  initialCount?: number;
  isLoggedIn: boolean;
}

export default function StarButton({ 
  listingId, 
  initialIsStarred = false,
  className = '',
  showCount = false,
  initialCount = 0,
  isLoggedIn = false
}: StarButtonProps) {
  const [isStarred, setIsStarred] = useState(initialIsStarred);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStar = () => {
    if (!isLoggedIn) {
      toast.info('Please log in to save this listing to your interested list');
      window.location.href = '/login?role=buyer';
      return;
    }

    setIsLoading(true);
    
    router.post(route('buyer.interested.toggle', { listing: listingId }), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        // Using type assertion to handle the flash data
        const flash = page.props.flash as { data?: { isInterested: boolean; interestedCount: number } } | undefined;
        const response = flash?.data;
        if (response) {
          setIsStarred(response.isInterested);
          setCount(response.interestedCount);
          toast.success(response.isInterested ? 
            'Listing added to your interested list' : 
            'Listing removed from your interested list'
          );
        } else {
          // Toggle the starred state locally if we don't get a response
          setIsStarred(!isStarred);
          toast.success(!isStarred ? 
            'Listing added to your interested list' : 
            'Listing removed from your interested list'
          );
        }
        setIsLoading(false);
      },
      onError: () => {
        toast.error('Failed to update your interest in this listing');
        setIsLoading(false);
      }
    });
  };

  return (
    <button
      onClick={handleToggleStar}
      disabled={isLoading}
      className={`flex items-center transition-colors ${className}`}
      aria-label={isStarred ? "Remove from interested" : "Add to interested"}
      title={isStarred ? "Remove from interested" : "Add to interested"}
    >
      <Star 
        className={`${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
          ${isLoading ? 'opacity-50' : 'hover:text-yellow-500'} h-5 w-5 transition-colors`} 
      />
      
      {/* {showCount && count > 0 && (
        <span className="ml-1 text-sm text-gray-600">{count}</span>
      )} */}
    </button>
  );
}
