import { useCart } from '../../../Context/CartContext.jsx';
import { useState } from "react";

export const MenuItemCard = ({ item }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const dummyRating = item.rating || 4.5;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-400">
        {Array(fullStars).fill().map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15.27l-3.24 1.71.62-3.61L4.32 9.27l3.62-.52L10 5.27l2.06 3.48 3.62.52-2.67 2.5.62 3.61zM10 18.37l-5.69 3 1.09-6.26-4.54-4.43 6.27-.91L10 0l2.87 5.77 6.27.91-4.54 4.43 1.09 6.26z" />
          </svg>
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    );
  };

  const handleAddToCartClick = async () => {
    setIsAddingToCart(true);
    const quantity = 1; 

    const itemToAdd = {
      itemId: item._id,
      name: item.name,          
      price: item.priceINR,
      currency: item?.currency || "INR",
      quantity,
      image: item.imageUrl || null,
      sourceId: item.restaurantId,
      itemModelType: 'Menu',
      sourceType: 'Restaurant',
      storeName: item.storeName, 
    };
    console.log(itemToAdd);
    try {
      await addToCart(itemToAdd);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col h-full relative">
      {item.isTopSeller && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          TOP SELLER
        </div>
      )}
      <img
        src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
        alt={item.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        }}
      />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow">{item.description}</p>
        <div className="flex items-center mb-2">
          {renderStars(dummyRating)}
          <span className="ml-2 text-gray-600 text-sm">({dummyRating.toFixed(1)})</span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-indigo-600 font-bold text-lg">₹{item.priceINR}</span>
          <div className="flex items-center space-x-2">
            {item.isVegetarian && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Veg</span>
            )}
            {item.isVegan && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Vegan</span>
            )}
            {!item.isAvailable && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Out of Stock</span>
            )}
          </div>
        </div>
        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          onClick={handleAddToCartClick}
          disabled={!item.isAvailable || isAddingToCart} 
        >
          {isAddingToCart ? 'Adding...' : (item.isAvailable ? 'Add to Cart' : 'Not Available')}
        </button>
      </div>
    </div>
  );
};