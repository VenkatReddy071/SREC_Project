import React from 'react';
import { FaEdit, FaTrashAlt, FaStar } from 'react-icons/fa';

export const ProductDetailView = ({
  selectedProduct,
  handleEditProductClick,
  handleDeleteClick,
  formatPrice,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-end space-x-3 mb-6">
        <button
          onClick={handleEditProductClick}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaEdit className="mr-2" /> Edit Product
        </button>
        <button
          onClick={() => handleDeleteClick(selectedProduct._id)}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          <FaTrashAlt className="mr-2" /> Delete Product
        </button>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>

      {selectedProduct.images && selectedProduct.images.length > 0 && (
        <div className="mb-4">
          <img
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            className="w-full h-64 object-contain rounded-lg shadow-md border border-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found"; }}
          />
          {selectedProduct.images.length > 1 && (
            <div className="flex mt-2 overflow-x-auto space-x-2 pb-2">
              {selectedProduct.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedProduct.name} thumbnail ${index + 2}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/CCCCCC/000000?text=N/A"; }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Price:</strong> {formatPrice(selectedProduct.price, selectedProduct.currency)}</p>
        <p><strong>Category:</strong> {selectedProduct.category}</p>
        <p><strong>Brand:</strong> {selectedProduct.brand || 'N/A'}</p>
        <p><strong>Gender:</strong> {selectedProduct.gender}</p>
        <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
        <p><strong>Status:</strong> <span className={`font-semibold ${selectedProduct.status === 'active' ? 'text-green-600' : selectedProduct.status === 'out_of_stock' ? 'text-red-600' : 'text-yellow-600'}`}>
          {selectedProduct.status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
        </span></p>
        <p><strong>Rating:</strong> {selectedProduct.averageRating} <FaStar className="inline text-yellow-500" /></p>
        <p><strong>Material:</strong> {selectedProduct.material || 'N/A'}</p>
        <p><strong>Sizes:</strong> {selectedProduct.availableSizes.length > 0 ? selectedProduct.availableSizes.join(', ') : 'N/A'}</p>
        <p><strong>Colors:</strong> {selectedProduct.availableColors.length > 0 ? selectedProduct.availableColors.join(', ') : 'N/A'}</p>
        <p className="md:col-span-2"><strong>Description:</strong> {selectedProduct.description || 'No description provided.'}</p>
        <p className="md:col-span-2 text-sm text-gray-500">
          Created: {new Date(selectedProduct.createdAt).toLocaleString()} |
          Updated: {new Date(selectedProduct.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
