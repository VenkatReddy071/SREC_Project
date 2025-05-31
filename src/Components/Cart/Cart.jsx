import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi"; // Shopping cart icon from react-icons

const Cart = () => {
  const [cartCount, setCartCount] = useState(0);

  // Simulated function to add items (can be integrated with other components later)
  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="relative">
      {/* Cart Icon with Count */}
      <div className="px-4">
        <div className="relative">
          <FiShoppingCart className="text-3xl text-gray-700 cursor-pointer" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* Temporary button for demonstration */}
      {/* <div className="absolute bottom-4 left-4">
        <button
          onClick={addToCart}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Add Item
        </button>
      </div> */}
    </div>
  );
};

export default Cart;
