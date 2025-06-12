
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
            <img src={product.images[0] || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-56 object-cover border-b border-gray-200" />
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                <p className="text-lg font-bold text-green-600 mt-auto pt-2">
                    {product.currency} {product.price ? product.price.toFixed(2) : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                {product.storeName && <p className="text-sm text-gray-500">Store: {product.storeName}</p>}
            </div>
        </div>
    );
};

export default ProductCard;