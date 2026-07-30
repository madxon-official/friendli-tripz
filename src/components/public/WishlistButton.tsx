'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions/wishlist';

interface WishlistButtonProps {
  packageFamilyId: string;
  initialIsWishlisted?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  packageFamilyId,
  initialIsWishlisted = false,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    // Optimistic update
    setIsWishlisted(!isWishlisted);
    const result = await toggleWishlist(packageFamilyId);
    if (result.success) {
      setIsWishlisted(result.isWishlisted);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2.5 rounded-full transition-all duration-200 ${
        isWishlisted
          ? 'bg-rose-500 text-white shadow-md scale-105'
          : 'bg-black/30 backdrop-blur-md text-white hover:bg-black/50'
      }`}
      aria-label="Wishlist button"
    >
      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </button>
  );
};
