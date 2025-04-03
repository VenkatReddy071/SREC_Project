import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import PesarattuDetails from "./Details"
const menuItems = [
  { name: "Pesarattu", orders: 120 },
  { name: "Ponganalu", orders: 80 },
  { name: "Uggani with Mirapakaya Bajji", orders: 150 },
  { name: "Idli", orders: 300 },
  { name: "Dosa", orders: 250 },
  { name: "Rayalaseema Biryani", orders: 500 },
  { name: "Pulihora (Tamarind Rice)", orders: 200 },
  { name: "Gutti Vankaya Curry", orders: 180 },
  { name: "Chicken Curry", orders: 400 },
  { name: "Mutton Fry", orders: 300 },
  { name: "Filter Coffee", orders: 600 },
  { name: "Masala Chai", orders: 500 },
  { name: "Butter Milk", orders: 350 },
  { name: "Lassi", orders: 250 },
  { name: "Boorelu", orders: 150 },
  { name: "Bobbatlu", orders: 100 },
  { name: "Ariselu", orders: 200 },
  { name: "Chekkalu", orders: 120 },
  { name: "Mysore Pak", orders: 300 },
];
const chartData = menuItems.map(item => ({
  name: item.name,
  orders: item.orders,
}));

const Overview = ({item}) => {
    const menuItems = [
        {
          name: "Pesarattu",
          image: "https://via.placeholder.com/150",
          info: "A healthy green gram dosa from Andhra Pradesh.",
          orders: 120,
          comments: ["Delicious and healthy!", "Best breakfast item."],
          status: "Available",
          rating: 4.5,
          price: 50,
          category: "Breakfast",
          ingredients: ["Green gram", "Rice flour", "Ginger", "Chilies"],
          isVegetarian: true,
        },
        {
          name: "Ponganalu",
          image: "https://via.placeholder.com/150",
          info: "Crispy and soft dumplings, perfect with chutney.",
          orders: 80,
          comments: ["My kids love it!", "Amazing flavor."],
          status: "Available",
          rating: 4.3,
          price: 40,
          category: "Snacks",
          ingredients: ["Rice flour", "Coconut", "Onions"],
          isVegetarian: true,
        },
        {
          name: "Uggani with Mirapakaya Bajji",
          image: "https://via.placeholder.com/150",
          info: "A popular Rayalaseema dish served with chili fritters.",
          orders: 150,
          comments: ["Spicy and flavorful!", "Authentic taste."],
          status: "Available",
          rating: 4.8,
          price: 70,
          category: "Main Course",
          ingredients: ["Rice", "Tamarind", "Chilies"],
          isVegetarian: true,
        },
        {
          name: "Idli",
          image: "https://via.placeholder.com/150",
          info: "Steamed rice cakes, soft and fluffy.",
          orders: 300,
          comments: ["Classic breakfast!", "Goes great with sambar."],
          status: "Available",
          rating: 4.7,
          price: 30,
          category: "Breakfast",
          ingredients: ["Rice", "Urad dal"],
          isVegetarian: true,
        },
        {
          name: "Dosa",
          image: "https://via.placeholder.com/150",
          info: "Crispy and golden South Indian crepe.",
          orders: 250,
          comments: ["Crispy perfection!", "Loved it with coconut chutney."],
          status: "Available",
          rating: 4.6,
          price: 50,
          category: "Breakfast",
          ingredients: ["Rice", "Urad dal"],
          isVegetarian: true,
        },
        {
          name: "Rayalaseema Biryani",
          image: "https://via.placeholder.com/150",
          info: "A spicy and aromatic biryani from Rayalaseema.",
          orders: 500,
          comments: ["The spice level is perfect!", "A must-try."],
          status: "Completed",
          rating: 4.9,
          price: 150,
          category: "Main Course",
          ingredients: ["Rice", "Chicken", "Spices"],
          isVegetarian: false,
        },
        {
          name: "Pulihora (Tamarind Rice)",
          image: "https://via.placeholder.com/150",
          info: "A tangy and savory rice dish flavored with tamarind.",
          orders: 200,
          comments: ["Tangy goodness!", "Perfect for a light lunch."],
          status: "Available",
          rating: 4.4,
          price: 60,
          category: "Main Course",
          ingredients: ["Rice", "Tamarind", "Spices"],
          isVegetarian: true,
        },
        {
          name: "Gutti Vankaya Curry",
          image: "https://via.placeholder.com/150",
          info: "Stuffed eggplant curry, a traditional Andhra favorite.",
          orders: 180,
          comments: ["Rich and delicious!", "The best curry I’ve had."],
          status: "Available",
          rating: 4.7,
          price: 100,
          category: "Main Course",
          ingredients: ["Eggplant", "Tamarind", "Spices"],
          isVegetarian: true,
        },
        {
          name: "Chicken Curry",
          image: "https://via.placeholder.com/150",
          info: "Spicy and flavorful South Indian chicken curry.",
          orders: 400,
          comments: ["Finger-licking good!", "Authentic taste."],
          status: "Completed",
          rating: 4.8,
          price: 200,
          category: "Main Course",
          ingredients: ["Chicken", "Spices", "Curry leaves"],
          isVegetarian: false,
        },
        {
          name: "Filter Coffee",
          image: "https://via.placeholder.com/150",
          info: "Strong and aromatic South Indian coffee.",
          orders: 600,
          comments: ["The best way to start your day!", "Perfect aroma."],
          status: "Available",
          rating: 4.9,
          price: 20,
          category: "Beverages",
          ingredients: ["Coffee", "Milk", "Sugar"],
          isVegetarian: true,
        },
        {
            name: "Masala Chai",
            image: "https://via.placeholder.com/150",
            info: "Aromatic tea with a blend of spices.",
            orders: 500,
            comments: ["Soothing and refreshing.", "Loved the flavor."],
            status: "Available",
            rating: 4.7,
            price: 20,
            category: "Beverages",
            ingredients: ["Tea leaves", "Milk", "Cardamom", "Cinnamon", "Ginger"],
            isVegetarian: true,
          },
          {
            name: "Butter Milk",
            image: "https://via.placeholder.com/150",
            info: "Refreshing drink to beat the heat.",
            orders: 350,
            comments: ["Perfectly spiced!", "Very refreshing."],
            status: "Available",
            rating: 4.6,
            price: 15,
            category: "Beverages",
            ingredients: ["Curd", "Water", "Cumin", "Coriander"],
            isVegetarian: true,
          },
          {
            name: "Lassi",
            image: "https://via.placeholder.com/150",
            info: "Sweet and creamy yogurt drink.",
            orders: 250,
            comments: ["The perfect dessert drink.", "So creamy!"],
            status: "Available",
            rating: 4.6,
            price: 25,
            category: "Beverages",
            ingredients: ["Curd", "Sugar", "Cardamom", "Rosewater"],
            isVegetarian: true,
          },
          {
            name: "Boorelu",
            image: "https://via.placeholder.com/150",
            info: "Sweet fried dumplings filled with jaggery and dal.",
            orders: 150,
            comments: ["Reminds me of home.", "Deliciously sweet."],
            status: "Completed",
            rating: 4.8,
            price: 40,
            category: "Desserts",
            ingredients: ["Jaggery", "Rice flour", "Chana dal", "Cardamom"],
            isVegetarian: true,
          },
          {
            name: "Bobbatlu",
            image: "https://via.placeholder.com/150",
            info: "Sweet flatbread stuffed with jaggery and lentils.",
            orders: 100,
            comments: ["Perfect for festivals.", "Authentic taste!"],
            status: "Available",
            rating: 4.5,
            price: 30,
            category: "Desserts",
            ingredients: ["Jaggery", "Wheat flour", "Chana dal", "Ghee"],
            isVegetarian: true,
          },
          {
            name: "Ariselu",
            image: "https://via.placeholder.com/150",
            info: "Traditional Andhra sweet made with rice flour and jaggery.",
            orders: 200,
            comments: ["Perfectly made!", "Rich and authentic."],
            status: "Available",
            rating: 4.6,
            price: 35,
            category: "Desserts",
            ingredients: ["Rice flour", "Jaggery", "Sesame seeds"],
            isVegetarian: true,
          },
          {
            name: "Chekkalu",
            image: "https://via.placeholder.com/150",
            info: "Crispy rice crackers with a hint of spice.",
            orders: 120,
            comments: ["Crunchy and delicious.", "Perfect snack!"],
            status: "Available",
            rating: 4.4,
            price: 25,
            category: "Snacks",
            ingredients: ["Rice flour", "Butter", "Green chilies", "Curry leaves"],
            isVegetarian: true,
          },
          {
            name: "Mysore Pak",
            image: "https://via.placeholder.com/150",
            info: "A rich and sweet gram flour fudge.",
            orders: 300,
            comments: ["Melts in your mouth!", "Loved the texture."],
            status: "Available",
            rating: 4.7,
            price: 50,
            category: "Desserts",
            ingredients: ["Gram flour", "Sugar", "Ghee"],
            isVegetarian: true,
          }
       
      ];
    useEffect(()=>{
        handleItem();
    },[item])
    const [selected,SetSelected]=useState(null);
    const handleItem=()=>{
        let selectItem=menuItems.find((prev)=>prev.name===item);
        SetSelected(selectItem);
    }
  return (
    <div>
        {selected ?
        <div>
            <PesarattuDetails item={selected}/>
        </div>
        :
        <div className="p-1">
      <h2 className="text-2xl font-bold text-center mb-4">Orders Visualization</h2>
      <BarChart
        width={800}
        height={400}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#82ca9d" />
      </BarChart>
        </div>
        }
    </div>
  );
};

export default Overview;
