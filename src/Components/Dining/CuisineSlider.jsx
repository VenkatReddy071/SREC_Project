export const CuisineSlider = ({ cuisines, onCuisineSelect }) => {
  return (
    <section className="py-8 px-8 mt-12 mb-8 overflow-hidden">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-['Inter']">Browse by Cuisine</h2>
      <div className="flex overflow-x-auto scrollbar-hide pb-4 px-4 space-x-4">
        {cuisines.map(cuisine => (
          <button
            key={cuisine}
            onClick={() => onCuisineSelect(cuisine)}
            className="flex-none w-36 h-36 flex flex-col items-center justify-center bg-gray-100 rounded-full shadow-lg hover:bg-orange-100 transition duration-300 transform hover:scale-105 active:scale-95 p-1"
          >
            <img
              src={'https://img.freepik.com/free-photo/potato-patties-topped-with-beef-patties-shoe-strings_140725-5889.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740'}
              alt={cuisine}
              className="rounded-full w-full h-full object-cover "
            />

          </button>
        ))}
      </div>
    </section>
  );
};