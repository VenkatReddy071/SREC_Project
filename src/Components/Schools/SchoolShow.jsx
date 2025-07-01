

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaFilter, FaTimes, FaSearch, FaMapPin, FaStar } from 'react-icons/fa';
import axios from "axios"
import {MenuItemSkeleton} from "../Dining/Showcase/MenuSkeleton"
import {Link} from "react-router-dom";
function Schools() {
  const [schools, setSchools] = useState([]);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    institutionType: '',
    location: '',
    name: '',
    minRating: '',
    maxRating: '',
    hostel: '',
    board: '',
    specialization: ''
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const observer = useRef();
  const lastSchoolElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const ITEMS_PER_LOAD = 5;

  const fetchSchools = useCallback(async () => {
    if (!hasMore && page > 1) return;

    setLoading(true);
    let apiUrl = `${import.meta.env.VITE_SERVER_URL}/api/school?page=${page}&limit=${ITEMS_PER_LOAD}`;

    const currentFilters = { ...filters };

    if (category !== 'All') {
      currentFilters.institutionType = category;
    } else {
      delete currentFilters.institutionType;
    }

    if (searchTerm) {
        currentFilters.name = searchTerm;
    }

    Object.keys(currentFilters).forEach(key => {
      if (currentFilters[key] !== '' && currentFilters[key] !== null && currentFilters[key] !== undefined) {
        apiUrl += `&${key}=${encodeURIComponent(currentFilters[key])}`;
      }
    });

    try {
      const response = await axios.get(apiUrl,{withCredentials:true});
      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = response.data;

      setSchools(prevSchools => {
        const newSchools = data.data.filter(
          (newSchool) => !prevSchools.some((prevSchool) => prevSchool._id === newSchool._id)
        );
        return [...prevSchools, ...newSchools];
      });

      setHasMore(data.data.length > 0 && (schools.length + data.data.length < data.total));

      if (data.page >= data.totalPages) {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error fetching schools:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, filters, hasMore, searchTerm, schools.length, category]);

  useEffect(() => {
    setSchools([]);
    setPage(1);
    setHasMore(true);
  }, [filters, searchTerm, category]);

  useEffect(() => {
    if (hasMore) {
      fetchSchools();
    }
  }, [page, fetchSchools, hasMore]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const applyFilters = () => {
    setIsFilterDrawerOpen(false);
    setSchools([]);
    setPage(1);
    setHasMore(true);
  };

  const clearFilters = () => {
    setFilters({
      institutionType: '',
      location: '',
      name: '',
      minRating: '',
      maxRating: '',
      hostel: '',
      board: '',
      specialization: ''
    });
    setSearchTerm('');
    setIsFilterDrawerOpen(false);
    setSchools([]);
    setPage(1);
    setHasMore(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 antialiased flex flex-col">
      <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 sm:mb-0">Educational Institutes</h1>
        <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mb-4 sm:mb-0">
          {['All', 'School', 'College'].map((catOption) => (
            <button
              key={catOption}
              onClick={() => setCategory(catOption)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
                ${category === catOption
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
            >
              {catOption}
            </button>
          ))}
        </div>
        <div className="relative flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 text-gray-400">
            <FaSearch className="w-5 h-5" />
          </span>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
          >
            <FaFilter className="w-5 h-5 mr-1" /> Filters
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-grow">
        {schools.length === 0 && !loading && !hasMore && (
          <div className="text-center text-gray-600 py-10">No institutes found matching your criteria.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, index) => {
            if (schools.length === index + 1) {
              return (
                <div ref={lastSchoolElementRef} key={school._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                    <Link to={`/showcase/page?type=${school?.institutionType}/${school?.name}/${school?._id}/Overview`}>
                  <img
                    src={school.image || `https://placehold.co/400x200/4F46E5/FFFFFF?text=${school.name}`}
                    alt={school.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/4F46E5/FFFFFF?text=${school.name}`; }}
                  />
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{school.name}</h2>
                    <p className="text-sm text-indigo-600 font-medium mb-2">{school.institutionType}</p>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <FaMapPin className="w-4 h-4 mr-1 text-gray-500" /> {school.location}
                    </div>
                    <div className="flex items-center mb-2">
                      {renderStars(school.rating)}
                      <span className="ml-2 text-gray-700 text-sm">({school.rating}/5)</span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-3">{school.info || 'No description available.'}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {school.hostel && <span className="px-2 py-1 bg-green-100 rounded-full">Hostel Available</span>}
                      {school.institutionType === 'School' && school.schoolDetails?.board && (
                        <span className="px-2 py-1 bg-blue-100 rounded-full">{school.schoolDetails.board} Board</span>
                      )}
                      {school.institutionType === 'College' && school.collegeDetails?.affiliationType && (
                        <span className="px-2 py-1 bg-purple-100 rounded-full">{school.collegeDetails.affiliationType}</span>
                      )}
                    </div>
                  </div>
                  </Link>
                </div>
              );
            }
            return (
            <Link to={`/showcase/page?type=${school?.institutionType}/${school?.name}/${school?._id}/Overview`}>
              <div key={school._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                <img
                  src={school.image || `https://placehold.co/400x200/4F46E5/FFFFFF?text=${school.name}`}
                  alt={school.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/4F46E5/FFFFFF?text=${school.name}`; }}
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{school.name}</h2>
                  <p className="text-sm text-indigo-600 font-medium mb-2">{school.institutionType}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FaMapPin className="w-4 h-4 mr-1 text-gray-500" /> {school.location}
                  </div>
                  <div className="flex items-center mb-2">
                    {renderStars(school.rating)}
                    <span className="ml-2 text-gray-700 text-sm">({school.rating}/5)</span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-3">{school.info || 'No description available.'}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {school.hostel && <span className="px-2 py-1 bg-green-100 rounded-full">Hostel Available</span>}
                    {school.institutionType === 'School' && school.schoolDetails?.board && (
                      <span className="px-2 py-1 bg-blue-100 rounded-full">{school.schoolDetails.board}</span>
                    )}
                    {school.institutionType === 'College' && school.collegeDetails?.affiliationType && (
                      <span className="px-2 py-1 bg-purple-100 rounded-full">{school.collegeDetails.affiliationType}</span>
                    )}
                  </div>
                </div>
              </div>
              </Link>
            );
          })}
          {loading && (
            Array.from({ length: 5 }).map((_, index) => <MenuItemSkeleton key={`skeleton-${index}`} />)
          )}
        </div>

        {!hasMore && schools.length > 0 && !loading && (
            <div className="text-center text-gray-500 py-8">You've reached the end of the list!</div>
        )}
      </main>

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30
          ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-indigo-700">Filters</h3>
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
            <select
              id="institutionType"
              name="institutionType"
              value={filters.institutionType}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="School">School</option>
              <option value="College">College</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
              placeholder="e.g., New Delhi"
            />
          </div>

          <div>
            <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">Min Rating (0-5)</label>
            <input
              type="number"
              id="minRating"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              min="0"
              max="5"
              step="1"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
              placeholder="e.g., 4"
            />
          </div>

          <div>
            <label htmlFor="maxRating" className="block text-sm font-medium text-gray-700 mb-1">Max Rating (0-5)</label>
            <input
              type="number"
              id="maxRating"
              name="maxRating"
              value={filters.maxRating}
              onChange={handleFilterChange}
              min="0"
              max="5"
              step="1"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
              placeholder="e.g., 5"
            />
          </div>

          <div className="flex items-center">
            <input
              id="hostel"
              name="hostel"
              type="checkbox"
              checked={filters.hostel === 'true' || filters.hostel === true}
              onChange={(e) => handleFilterChange({ target: { name: e.target.name, value: e.target.checked ? 'true' : 'false', type: 'checkbox' } })}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="hostel" className="ml-2 block text-sm text-gray-900">Hostel Available</label>
          </div>

          {filters.institutionType === 'School' && (
            <div>
              <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">Board</label>
              <select
                id="board"
                name="board"
                value={filters.board}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="BSEAP">BSEAP</option>
                <option value="Other State Board">Other State Board</option>
                <option value="International">International</option>
              </select>
            </div>
          )}

          {filters.institutionType === 'College' && (
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2"
                placeholder="e.g., Engineering"
              />
            </div>
          )}

          <div className="flex space-x-2 mt-6">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {isFilterDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsFilterDrawerOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Schools;