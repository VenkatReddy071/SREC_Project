import React from "react";
import "./Order.css"
function Review() {
  const reviews = [
    {
      name: "John Doe",
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1740654600~exp=1740658200~hmac=d0df7975fc4cc987ed18cb2f2ee4e7ec5fe28c692e5ec101e4ccda7026ad3c45&w=1800",
      rating: 4,
      review:
        "Great website! The user interface is clean and easy to navigate. Highly recommend!",
    },
    {
      name: "Jane Smith",
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1740654600~exp=1740658200~hmac=d0df7975fc4cc987ed18cb2f2ee4e7ec5fe28c692e5ec101e4ccda7026ad3c45&w=1800",
      rating: 5,
      review:
        "Absolutely fantastic experience. Found everything I needed quickly!",
    },
    {
      name: "Alice Johnson",
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1740654600~exp=1740658200~hmac=d0df7975fc4cc987ed18cb2f2ee4e7ec5fe28c692e5ec101e4ccda7026ad3c45&w=1800",
      rating: 3,
      review:
        "Good website, but it could use a bit more speed. Overall, a decent experience.",
    },
    {
      name: "Bob Brown",
      image: "https://img.freepik.com/free-photo/waist-up-portrait-handsome-serious-unshaven-male-keeps-hands-together-dressed-dark-blue-shirt-has-talk-with-interlocutor-stands-against-white-wall-self-confident-man-freelancer_273609-16320.jpg?t=st=1740654600~exp=1740658200~hmac=d0df7975fc4cc987ed18cb2f2ee4e7ec5fe28c692e5ec101e4ccda7026ad3c45&w=1800",
      rating: 4,
      review:
        "The design is excellent, but I faced some minor issues with the checkout process.",
    },
  ];

  return (
    <div className="review-container">
      <h1 className="review-heading">User Reviews</h1>
      <div className="review-cards">
        {reviews.map((user, index) => (
          <div key={index} className="review-card">
            <img src={user.image} alt={user.name} className="user-image" />
            <h3 className="user-name">{user.name}</h3>
            <div className="user-rating">
              {"⭐".repeat(user.rating)}
              {"☆".repeat(5 - user.rating)}
            </div>
            <p className="user-review">{user.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Review;
