const FilterSidebar = ({ filters, onFilterChange, onClearFilters, uniqueCategories, uniqueBrands, uniqueGenders }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value,
        });
    };

    return (
        <aside className="w-72 bg-white p-6 rounded-lg shadow-lg sticky top-8 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3">Filters</h2>
            <button
                onClick={onClearFilters}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200 text-base font-medium mb-6"
            >
                Clear All Filters
            </button>

            <div className="mb-5">
                <label htmlFor="category-filter" className="block text-gray-700 text-sm font-semibold mb-2">Category:</label>
                <select
                    id="category-filter"
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label htmlFor="brand-filter" className="block text-gray-700 text-sm font-semibold mb-2">Brand:</label>
                <input
                    type="text"
                    id="brand-filter"
                    name="brand"
                    placeholder="Search by brand"
                    value={filters.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
            </div>

            <div className="mb-5">
                <label htmlFor="gender-filter" className="block text-gray-700 text-sm font-semibold mb-2">Gender:</label>
                <select
                    id="gender-filter"
                    name="gender"
                    value={filters.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                    <option value="">All Genders</option>
                    {uniqueGenders.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range:</label>
                <div className="flex items-center space-x-3">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleInputChange}
                        className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleInputChange}
                        className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar