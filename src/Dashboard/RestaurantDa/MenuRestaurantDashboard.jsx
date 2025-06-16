import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaPlusCircle, FaEdit, FaTrash, FaSpinner, FaUtensils } from 'react-icons/fa';
import MenuListItem from './MenuList';
import MenuDetailsPanel from './MenuDeatils';
import AddEditMenuForm from './AddMenuForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
const ITEMS_PER_PAGE = 20;

const RestaurantMenuDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    productType: '',
    isVegetarian: false,
    isVegan: false,
    isAvailable: false,
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastMenuItemRef = useCallback(node => {
    if (loading || loadingMore || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const fetchMenuItems = useCallback(async (currentPage) => {
    if (currentPage === 1) {
      setLoading(true);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const token = localStorage.getItem('dashboard');

      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', ITEMS_PER_PAGE);

      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      if (filters.productType) {
        queryParams.append('productType', filters.productType);
      }
      if (filters.isVegetarian) {
        queryParams.append('isVegetarian', 'true');
      }
      if (filters.isVegan) {
        queryParams.append('isVegan', 'true');
      }
      if (filters.isAvailable) {
        queryParams.append('isAvailable', 'true');
      }

      const url = `${API_BASE_URL}/api/menu/restaurant-by-email?${queryParams.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const newProducts = response.data?.data?.products || [];
      const totalProducts = response.data?.total || 0;

      setMenuItems(prevItems => (currentPage === 1 ? newProducts : [...prevItems, ...newProducts]));
      setFilteredMenuItems(prevFiltered => (currentPage === 1 ? newProducts : [...prevFiltered, ...newProducts]));

      setHasMore(newProducts.length === ITEMS_PER_PAGE && ((currentPage * ITEMS_PER_PAGE) < totalProducts));

    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
      toast.error('Failed to load menu items.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    setPage(1);
    setMenuItems([]);
    setFilteredMenuItems([]);
    setHasMore(true);
    fetchMenuItems(1);
  }, [fetchMenuItems]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchMenuItems(page);
    }
  }, [page, hasMore]);

  useEffect(() => {
    let currentItems = [...menuItems];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentItems = currentItems.filter(item =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseQuery))
      );
    }
    if (filters.category) {
      currentItems = currentItems.filter(item => item.category === filters.category);
    }
    if (filters.productType) {
      currentItems = currentItems.filter(item => item.productType === filters.productType);
    }
    if (filters.isVegetarian) {
      currentItems = currentItems.filter(item => item.isVegetarian);
    }
    if (filters.isVegan) {
      currentItems = currentItems.filter(item => item.isVegan);
    }
    if (filters.isAvailable) {
      currentItems = currentItems.filter(item => item.isAvailable);
    }
    setFilteredMenuItems(currentItems);
  }, [searchQuery, filters, menuItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  const handleAddNewMenuClick = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    setSelectedMenuItem(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleFormSubmit = async (formData, isNew) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('dashboard');
      let response;
      if (isNew) {
        response = await axios.post(`${API_BASE_URL}/api/menu`, { ...formData}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success('Menu item added successfully!');
      } else {
        response = await axios.patch(`${API_BASE_URL}/api/menu/${selectedMenuItem._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success('Menu item updated successfully!');
      }
      setSelectedMenuItem(response.data?.data?.product);
      setIsAddingNew(false);
      setIsEditing(false);
      setPage(1);
      
      setHasMore(true);
      fetchMenuItems(1);
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save menu item.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('dashboard');
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success('Menu item deleted successfully!');
      setSelectedMenuItem(null);
      setPage(1);
      setMenuItems([]);
      setFilteredMenuItems([]);
      setHasMore(true);
      fetchMenuItems(1);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete menu item.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = [...new Set(menuItems.map(item => item.category).filter(Boolean))];
  const uniqueProductTypes = [...new Set(menuItems.map(item => item.productType).filter(Boolean))];

  return (
    <div className="flex h-full bg-gray-100 font-sans gap-6">
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
            <FaUtensils className="text-blue-600" /> Your Menu
          </h2>
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Type</label>
              <select
                id="productType"
                name="productType"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.productType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {uniqueProductTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={filters.isVegetarian}
                onChange={handleFilterChange}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded-sm"
              />
              <span className="ml-2">Vegetarian</span>
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="isVegan"
                checked={filters.isVegan}
                onChange={handleFilterChange}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded-sm"
              />
              <span className="ml-2">Vegan</span>
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={filters.isAvailable}
                onChange={handleFilterChange}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded-sm"
              />
              <span className="ml-2">Available Only</span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {(loading && page === 1) && (
            <div className="flex justify-center items-center h-full text-blue-600">
              <FaSpinner className="animate-spin text-4xl" />
            </div>
          )}
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          {!loading && !error && filteredMenuItems.length === 0 && (
            <div className="text-center text-gray-500 mt-4">No menu items found.</div>
          )}
          {!loading && !error && (
            <div className="grid gap-3">
              {filteredMenuItems.map((item, index) => {
                if (filteredMenuItems.length === index + 1) {
                  return (
                    <MenuListItem
                      key={item._id}
                      item={item}
                      isSelected={selectedMenuItem?._id === item._id}
                      onClick={() => handleMenuItemClick(item)}
                      ref={lastMenuItemRef}
                    />
                  );
                } else {
                  return (
                    <MenuListItem
                      key={item._id}
                      item={item}
                      isSelected={selectedMenuItem?._id === item._id}
                      onClick={() => handleMenuItemClick(item)}
                    />
                  );
                }
              })}
            </div>
          )}
          {loadingMore && (
            <div className="flex justify-center items-center py-4 text-blue-600">
              <FaSpinner className="animate-spin text-2xl" /> Loading more...
            </div>
          )}
          {!hasMore && !loading && !loadingMore && filteredMenuItems.length > 0 && (
            <div className="text-center text-gray-500 py-4">You've reached the end of the menu.</div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
          <button
            onClick={handleAddNewMenuClick}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <FaPlusCircle className="text-xl" />
            <span className="text-lg font-semibold">Add New Menu Item</span>
          </button>
        </div>
      </div>

      <div className="w-2/3 bg-white p-6 shadow-xl flex flex-col">
        {isAddingNew ? (
          <AddEditMenuForm onSubmit={handleFormSubmit} initialData={{ restaurantId: '684e3a6b332c0331e8aaaba7' }} isNew={true} onCancel={() => setIsAddingNew(false)} />
        ) : isEditing ? (
          <AddEditMenuForm onSubmit={handleFormSubmit} initialData={selectedMenuItem} isNew={false} onCancel={() => setIsEditing(false)} />
        ) : selectedMenuItem ? (
          <MenuDetailsPanel
            item={selectedMenuItem}
            onEdit={handleEditClick}
            onDelete={handleDeleteMenuItem}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-2xl font-semibold">
            <FaUtensils className="text-4xl mr-3 text-gray-400" /> Select a menu item or add a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuDashboard;