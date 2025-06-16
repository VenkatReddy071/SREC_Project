import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaFilter,FaInfoCircle,FaEdit,FaTrashAlt } from "react-icons/fa";
import { ConfirmationModal } from './ConformationModel';
import { ProductForm } from './ProductForm';
import { ProductDetailView } from './ProductDetailView';

const formatPrice = (price, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

const categories = [
  "Men", "Women", "Kids", "Books", "Footwear", "Accessories", "Gifts",
];
const genders = ["Men", "Women", "Unisex", "Kids"];
const statuses = ["active", "inactive", "out_of_stock"];

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeView, setActiveView] = useState("initial"); // 'initial', 'details', 'form'
  const [formData, setFormData] = useState({
    name: "", description: "", images: [], price: 0, currency: "INR",
    category: "Men", brand: "", availableSizes: [], availableColors: [],
    material: "", gender: "Unisex", mall: "", storeName: "",
    stockQuantity: 0, status: "active", averageRating: 3,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("dashboard");
      const mallEmail = 'jaipurplaza14597@shopcentral.com';
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/malls/email/${mallEmail}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log(response.data);
      setProducts(response.data.products || response.data.mall?.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let currentProducts = [...products];

    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      currentProducts = currentProducts.filter(product => product.category === filterCategory);
    }
    if (filterGender) {
      currentProducts = currentProducts.filter(product => product.gender === filterGender);
    }
    if (filterStatus) {
      currentProducts = currentProducts.filter(product => product.status === filterStatus);
    }

    return currentProducts;
  }, [products, searchTerm, filterCategory, filterGender, filterStatus]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stockQuantity" || name === "averageRating") {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === "images" || name === "availableSizes" || name === "availableColors") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()).filter(item => item !== ''),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "", description: product.description || "",
      images: product.images || [], price: product.price || 0,
      currency: product.currency || "INR", category: product.category || "Men",
      brand: product.brand || "", availableSizes: product.availableSizes || [],
      availableColors: product.availableColors || [], material: product.material || "",
      gender: product.gender || "Unisex", mall: product.mall || "",
      storeName: product.storeName || "", stockQuantity: product.stockQuantity || 0,
      status: product.status || "active", averageRating: product.averageRating || 3,
    });
    setActiveView("details");
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setFormData({
      name: "", description: "", images: [], price: 0, currency: "INR",
      category: "Men", brand: "", availableSizes: [], availableColors: [],
      material: "", gender: "Unisex", mall: "", storeName: "",
      stockQuantity: 0, status: "active", averageRating: 3,
    });
    setActiveView("form");
  };

  const handleEditProductClick = () => {
    setActiveView("form");
  };

  const handleCancelForm = () => {
    if (selectedProduct) {
      setActiveView("details");
    } else {
      setActiveView("initial");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("dashboard");
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        withCredentials: true,
      };

      const finalFormData = { ...formData };
      if (!selectedProduct && !finalFormData.mall) {
        finalFormData.mall = "684a6fca56a652fa73427d2b";
        finalFormData.storeName = "Sample Fashion Store";
      }

      if (selectedProduct?._id && activeView === "form") {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/product/update/${selectedProduct._id}`,
          finalFormData, config
        );
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/product/add-by-mall-email`, finalFormData, config);
      }
      await fetchProducts();
      handleCancelForm();
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDeleteId(productId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    if (!productToDeleteId) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("dashboard");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/products/${productToDeleteId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      await fetchProducts();
      if (selectedProduct && selectedProduct._id === productToDeleteId) {
        setSelectedProduct(null);
        setActiveView("initial");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
      setProductToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDeleteId(null);
  };

  const SelectProductMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
      <FaInfoCircle className="w-16 h-16 mb-4 text-blue-400" />
      <p className="text-xl font-semibold mb-2 text-center">Select a Product to View/Edit</p>
      <p className="text-lg text-center">Or click "Add New Product" button below to create one.</p>
    </div>
  );

  const renderRightPanelContent = () => {
    if (activeView === "form") {
      return (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          selectedProduct={selectedProduct}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
          handleCancelForm={handleCancelForm}
          handleInputChange={handleInputChange}
          categories={categories}
          genders={genders}
          statuses={statuses}
        />
      );
    } else if (activeView === "details" && selectedProduct) {
      return (
        <ProductDetailView
          selectedProduct={selectedProduct}
          handleEditProductClick={handleEditProductClick}
          handleDeleteClick={handleDeleteClick}
          formatPrice={formatPrice}
        />
      );
    } else {
      return <SelectProductMessage />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100 space-y-6 md:space-y-0 md:space-x-6">
      <div className="w-full md:w-[38%] bg-white rounded-lg shadow-lg p-4 overflow-hidden flex flex-col relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Products List</h2>

        <div className="mb-2 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="">All Genders</option>
              {genders.map(gen => <option key={gen} value={gen}>{gen}</option>)}
            </select>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => <option key={status} value={status}>{status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</option>)}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-full min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-10">No products found matching your criteria.</p>
        )}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`flex items-center justify-between p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-200
                ${
                  selectedProduct?._id === product._id
                    ? "bg-blue-100 border-blue-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center flex-1 min-w-0" onClick={() => handleSelectProduct(product)}>
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/60x60/CCCCCC/000000?text=No+Img"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md mr-4 border border-gray-200 flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/CCCCCC/000000?text=No+Img"; }}
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {product.category} | {formatPrice(product.price, product.currency)}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProduct(product);
                    handleEditProductClick();
                  }}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
                  title="Edit Product"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(product._id);
                  }}
                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-colors"
                  title="Delete Product"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md">
          <button
            onClick={handleAddNewProduct}
            className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold shadow-lg"
          >
            <FaPlus className="mr-2" /> Add New Product
          </button>
        </div>
      </div>

      <div className="w-full md:w-[60%] bg-white rounded-lg shadow-lg overflow-y-auto custom-scrollbar">
        {renderRightPanelContent()}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
      />
    </div>
  );
};

