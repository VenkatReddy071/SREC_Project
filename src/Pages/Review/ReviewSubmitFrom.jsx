import React, { useState, useCallback } from 'react';
import { PlusCircle, Send, Star, StarHalf } from 'lucide-react';
export const ReviewSubmissionForm = ({ onSubmitReview }) => {
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewerName, setNewReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleStarClick = useCallback((ratingValue) => {
    setNewReviewRating(ratingValue);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!newReviewerName.trim()) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (newReviewRating === 0) {
      setSubmitError('Please select a star rating.');
      return;
    }
    if (!newReviewComment.trim()) {
      setSubmitError('Please enter your review comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const submittedReview = {
        id: Date.now().toString(),
        reviewerName: newReviewerName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      if (onSubmitReview) {
        await onSubmitReview(submittedReview);
      }

      setNewReviewRating(0);
      setNewReviewComment('');
      setNewReviewerName('');
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-grow flex flex-col">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
        <PlusCircle className="mr-2 text-indigo-600" size={30} />
        Drop a Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col justify-between">
        <div>
          <div>
            <label htmlFor="reviewerName" className="block text-gray-700 text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="reviewerName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              value={newReviewerName}
              onChange={(e) => setNewReviewerName(e.target.value)}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Your Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  size={28}
                  className={`cursor-pointer transition-colors duration-200 ${
                    newReviewRating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                  } hover:text-yellow-500 hover:fill-yellow-500`}
                  onClick={() => handleStarClick(starValue)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="reviewComment" className="block text-gray-700 text-sm font-medium mb-2">
              Your Comment
            </label>
            <textarea
              id="reviewComment"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 min-h-[100px]"
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              placeholder="Share your thoughts about this product/service..."
              rows="4"
              disabled={isSubmitting}
            ></textarea>
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm mt-4">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm mt-4">
              Review submitted successfully!
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 mt-6
            ${isSubmitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'}
            text-white shadow-md`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};
