// src/components/ReviewList.tsx

import React from 'react';
import Review from './Review';

const ReviewList = ({ reviews }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <Review key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <p>No reviews yet. Be the first to write one!</p>
            )}
        </div>
    );
};

export default ReviewList;