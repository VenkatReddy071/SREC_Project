import React from 'react';
import { FaEdit, FaPlus, FaTimes, FaStar } from 'react-icons/fa';

export const ProductForm = ({
  formData,
  setFormData,
  selectedProduct,
  loading,
  error,
  handleSubmit,
  handleCancelForm,
  handleInputChange,
  categories,
  genders,
  statuses
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {selectedProduct ? `Edit Product: ${selectedProduct.name}` : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name <FaStar className="inline text-red-500 text-xs ml-1" />
          </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}
            rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Image URLs (comma-separated)
          </label>
          <input type="text" id="images" name="images" value={formData.images.join(", ")} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., https://example.com/img1.jpg, https://example.com/img2.jpg" />
          {formData.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.images.map((img, index) => (
                <img key={index} src={img} alt={`Product Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/CCCCCC/000000?text=N/A"; }}
                  />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price <FaStar className="inline text-red-500 text-xs ml-1" />
            </label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              min="0" required />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency <FaStar className="inline text-red-500 text-xs ml-1" />
            </label>
            <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <FaStar className="inline text-red-500 text-xs ml-1" />
          </label>
          <select id="category" name="category" value={formData.category} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="availableSizes" className="block text-sm font-medium text-gray-700">
              Available Sizes (comma-separated)
            </label>
            <input type="text" id="availableSizes" name="availableSizes" value={formData.availableSizes.join(", ")} onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., S, M, L, XL" />
          </div>
          <div>
            <label htmlFor="availableColors" className="block text-sm font-medium text-gray-700">
              Available Colors (comma-separated)
            </label>
            <input type="text" id="availableColors" name="availableColors" value={formData.availableColors.join(", ")} onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Red, Blue, Black" />
          </div>
        </div>

        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
          <input type="text" id="material" name="material" value={formData.material} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            {genders.map((gen) => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mall" className="block text-sm font-medium text-gray-700">
            Mall ID <FaStar className="inline text-red-500 text-xs ml-1" />
          </label>
          <input type="text" id="mall" name="mall" value={formData.mall} onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed"
            required disabled />
        </div>
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Store Name <FaStar className="inline text-red-500 text-xs ml-1" />
          </label>
          <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleInputChange}
            className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed"
            required disabled />
        </div>

        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            min="0" />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="averageRating" className="block text-sm font-medium text-gray-700">
            Average Rating (0-5)
          </label>
          <input type="number" id="averageRating" name="averageRating" value={formData.averageRating} onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            min="0" max="5" step="0.1" />
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={handleCancelForm}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
            <FaTimes className="mr-2" /> Cancel
          </button>
          <button type="submit"
            className={`flex items-center px-6 py-2 rounded-md transition-colors ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Saving...
              </>
            ) : selectedProduct ? (
              <>
                <FaEdit className="mr-2" /> Update Product
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
