import React, { useState } from 'react';

export const ReviewsContent = () => {
  // State for the review form inputs
  const [hospitalName, setHospitalName] = useState('');
  const [rating, setRating] = useState(0); // 1 to 5 stars
  const [reviewText, setReviewText] = useState('');

  // State for storing and displaying reviews (mock data for now)
  const [reviews, setReviews] = useState([
    { id: 1, username: 'JS', hospital: 'Apollo Hospitals', rating: 5, text: 'Fantastic care and highly professional doctors. My experience was excellent!' },
    { id: 2, username: 'PK', hospital: 'Max Healthcare', rating: 4, text: 'Good facilities, but the waiting time was a bit long. Otherwise, satisfied.' },
    { id: 3, username: 'SR', hospital: 'Fortis Hospital', rating: 5, text: 'Very clean and organized. The staff were incredibly supportive.' },
    { id: 4, username: 'AR', hospital: 'AIIMS Delhi', rating: 3, text: 'Competent doctors, but the administrative process needs improvement.' },
  ]);

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!hospitalName || !rating || !reviewText) {
      alert('Please fill in all review fields!');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      username: 'YN', // Placeholder for "Your Name" initials
      hospital: hospitalName,
      rating: parseInt(rating),
      text: reviewText,
    };

    setReviews([newReview, ...reviews]); // Add new review to the top

    // Clear the form
    setHospitalName('');
    setRating(0);
    setReviewText('');

    alert('Your review has been submitted!');
    // In a real application, you'd send 'newReview' data to your backend API here.
  };

  // Render star icons based on rating
  const renderStars = (numRating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}>
          &#9733; {/* Unicode star character */}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      {/* Left Side: Post Review Form */}
      <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Post a Review</h2>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label htmlFor="hospitalName" className="block text-gray-700 text-sm font-semibold mb-2">
              Hospital Name:
            </label>
            <input
              type="text"
              id="hospitalName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700 text-sm font-semibold mb-2">
              Rating:
            </label>
            <div className="flex items-center text-gray-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer ${star <= rating ? 'text-yellow-400' : ''}`}
                  onClick={() => setRating(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reviewText" className="block text-gray-700 text-sm font-semibold mb-2">
              Your Review:
            </label>
            <textarea
              id="reviewText"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Right Side: Display Reviews */}
      <div className="w-full md:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">What People Say</h2>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-semibold mr-4">
                    {review.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{review.username}</p>
                    <p className="text-sm text-gray-500">{review.hospital}</p>
                  </div>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};