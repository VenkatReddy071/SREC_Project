import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from '../../Context/CartContext.jsx';
import CartSidebar from "./CartSidebar"
const Cart = () => {
  const {cartLength} = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const toggleCartSidebar = () => {
        setIsCartSidebarOpen(!isCartSidebarOpen);
    };
  return (
    <div className="relative z-10">
      <div className="px-4">
        <div className="relative" onClick={toggleCartSidebar}>

          <FiShoppingCart className="text-3xl text-gray-700 cursor-pointer" />
          {cartCount >=0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartLength}
            </span>
          )}
        </div>
      </div>
     <CartSidebar isOpen={isCartSidebarOpen} onClose={() => setIsCartSidebarOpen(false)} />
    </div>
  );
};

export default Cart;
