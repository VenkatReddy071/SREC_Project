import React, { useState,useEffect } from 'react';
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
export const ReviewsContent = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const typeUrl = urlParams.get('type');
  const IdParts = typeUrl?.split("/");
  const HospitalId = IdParts && IdParts.length > 2 ? IdParts[2] : null;
  const [hospitalName, setHospitalName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading,setLoading]=useState(false);
  const [reviews,setReviews]=useState([]);

  useEffect(()=>{
    const fetch=async()=>{
        try{
      const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/review/Restaurant/${HospitalId}`,{withCredentials:true});
      if(response?.status===200){
        setReviews(response.data);

      }
      else{
          alert('Your review has been not submitted due to server issue !');
      }
    }
    catch(error){
      alert("Error",error.message);
    }
    }
    fetch();
  },[])
  const handleSubmitReview =async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      alert('Please fill in all review fields!');
      return;
    }
    setLoading(true);
    const data={
      rating,
      comment:reviewText,
      educationalInstitute:HospitalId,
      modelType:"Restaurant",
    }
    try{
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/review`,{data},{withCredentials:true});
      if(response?.status===200){
        setReviews([response.data, ...reviews]);
          setRating(0);
          setReviewText('');

      }
      else{
          alert('Your review has been not submitted due to server issue !');
      }
    }
    catch(error){
      alert("Error",error.message);
    }
    finally{
      setLoading(false);
    }
  };


  const renderStars = (numRating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Post a Review</h2>
        <form onSubmit={handleSubmitReview}>
          

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
          {loading ?" Submitting...":"Submit Review"}
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md h-screen overflow-scroll">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">What People Say</h2>
        {reviews?.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className="space-y-6">
            {reviews?.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-semibold mr-4">
                    {review.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{review.username}</p>
                    <p className="text-sm text-gray-500">{review?.educationalInstitute?.name}</p>
                  </div>
                </div>
                <div className="mb-2">{renderStars(review.rating)}</div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};