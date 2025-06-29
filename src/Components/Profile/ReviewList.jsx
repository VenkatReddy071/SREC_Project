import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid'; // Requires @heroicons/react

// Install heroicons: npm install @heroicons/react

function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p className="text-xl font-medium mb-2">No reviews found.</p>
                <p>It looks like you haven't shared your experiences yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg border border-blue-50 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-blue-700">{review.title}</h3>
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-base line-clamp-3">{review.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{review.category} - {review.date}</span>
                        <button className="text-blue-500 hover:underline text-sm font-medium">Read More</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;