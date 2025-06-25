import React, { useState, useCallback } from 'react';
import { PlusCircle, Send, Star, StarHalf } from 'lucide-react';
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={16} fill="#FFD700" stroke="#FFD700" />
      ))}
      {hasHalfStar && <StarHalf size={16} fill="#FFD700" stroke="#FFD700" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={16} fill="none" stroke="#CBD5E0" />
      ))}
    </div>
  );
};
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};
const ProfileAvatar = ({ name }) => {
  const initials = getInitials(name);
  const bgColor = `hsl(${initials.charCodeAt(0) * 5 % 360}, 70%, 70%)`;

  return (
    <div 
      className="flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold shadow-md flex-shrink-0"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export const ReviewsDisplay = ({ reviews }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-grow overflow-y-auto max-h-[80vh]">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
        Customer Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4">
              <ProfileAvatar name={review.reviewerName} />
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-lg font-semibold text-gray-800">{review.reviewerName}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};