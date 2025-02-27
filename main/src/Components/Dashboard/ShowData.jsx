import React from "react";
import "./Order.css"
function ShowData() {
  const trendingFoodItems = [
    {
      image: "https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?t=st=1740654114~exp=1740657714~hmac=cf96df866e21eace551f9f0dd08974999e303262b44c565503ee699f95ea4ac8&w=1380",
      name: "Pizza Margherita",
      price: 12,
      totalOrders: 250,
      totalAmount: 3000,
    },
    {
      image: "https://img.freepik.com/free-photo/mixed-sushi-set-japanese-food_1339-3611.jpg?t=st=1740654160~exp=1740657760~hmac=615b9beec7b62375977c8ac70c949121dd20570c94bf1c665b39da92c1f822d6&w=1800",
      name: "Sushi Platter",
      price: 25,
      totalOrders: 150,
      totalAmount: 3750,
    },
    {
      image: "https://img.freepik.com/free-photo/juicy-cheeseburger-rustic-wooden-board_9975-24623.jpg?t=st=1740654195~exp=1740657795~hmac=23cf53a3ec57fefb242010456800822db393ac63c272048cec2be29cf6de737b&w=2000",
      name: "Cheeseburger",
      price: 10,
      totalOrders: 300,
      totalAmount: 3000,
    },
    {
      image: "https://img.freepik.com/free-photo/vegetable-salad-with-chopped-cabbage-carrot-tomato-slices-lettuce-broccoli_114579-3109.jpg?t=st=1740654221~exp=1740657821~hmac=4546f78d2bd8b14ebc46b6f902bc320804dc3397d69aee1e44479ae7f43f6603&w=1800",
      name: "Vegan Salad Bowl",
      price: 15,
      totalOrders: 200,
      totalAmount: 3000,
    },
  ];

  return (
    <div className="trending-container">
      {trendingFoodItems.map((item, index) => (
        <div key={index} className="food-card">
          <img src={item.image} alt={item.name} className="food-image" />
          <h3 className="food-name">{item.name}</h3>
          <p className="food-price">Price: ${item.price}</p>
          <p className="food-orders">Total Orders: {item.totalOrders}</p>
          <p className="food-amount">Total Amount: ${item.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default ShowData;
