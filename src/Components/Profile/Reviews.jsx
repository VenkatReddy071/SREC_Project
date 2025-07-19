import React, { useState,useEffect } from 'react';
import axios from "axios";

export const ReviewsContent = () => {
 
  const [reviews,setReviews]=useState([]);

  useEffect(()=>{
    const fetch=async()=>{
        try{
      const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/review/user`,{withCredentials:true});
      if(response?.status===200){
        setReviews(response.data);

      }
      else{
          alert('Your review has been not submitted due to server issue !');
      }
    }
    catch(error){
    }
    }
    fetch();
  },[])
  

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
      

      <div className="w-full  bg-gray-50 p-8 rounded-lg shadow-md ">
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