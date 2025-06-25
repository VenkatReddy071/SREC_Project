import React from 'react'
import React, { useState, useCallback } from 'react';

import {ReviewsDisplay}from "./ReviewDisplay"
import {ReviewSubmissionForm} from "./ReviewSubmitFrom"
export const Review = () => {
    const handleNewReviewSubmission = useCallback(async (newReviewData) => {
    setAllReviews((prevReviews) => [newReviewData, ...prevReviews]);
  }, []);
 return (
    <div className=" bg-gray-100 font-inter p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-8 pb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-xl p-6">
         Reviews
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReviewSubmissionForm onSubmitReview={handleNewReviewSubmission} />
        <ReviewsDisplay reviews={allReviews} />
      </div>
    </div>
  );
}
