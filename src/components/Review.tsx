// src/components/Review.tsx

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid'; // You'll need to install @heroicons/react

const Review = ({ review }) => {
    return (
        <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
                <div className="flex items-center">
                    {/* Star Rating */}
                    {[...Array(5)].map((_, i) => (
                        <StarIcon
                            key={i}
                            className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
                <h3 className="ml-4 text-lg font-bold">{review.title}</h3>
            </div>

            <p className="text-gray-600 mb-2">{review.comment}</p>

            <div className="text-sm text-gray-500 flex items-center gap-4">
                <span>{review.user?.full_name || 'Anonymous'}</span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>

                {/* The all-important "Verified Purchase" badge */}
                {review.is_verified_purchase && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            ✅ Verified Purchase
          </span>
                )}
            </div>
        </div>
    );
};

export default Review;