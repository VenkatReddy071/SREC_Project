import {RestaurantCard} from "./RestaurantCard"
export const TopRestaurantsSlider = ({ restaurants }) => {
  const topPicks = restaurants.filter(rest => rest.isTopPick);
  if (topPicks.length === 0) return null;
  return (
    <section className="py-8  rounded-xl  mt-12 mb-8 overflow-hidden">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-['Inter']">Top Restaurant Picks</h2>
      <div className="flex overflow-x-auto scrollbar-hide pb-4 px-4 space-x-6">
        {topPicks.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
};