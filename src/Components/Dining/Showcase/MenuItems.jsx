import {useState,useRef,useEffect,useCallback}from "react"
import {MenuItemCard} from "./MenuItemCard"
import {MenuItemSkeleton} from "./MenuSkeleton"
import axios from "axios"
export const MenuItems = ({ restaurant }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const restaurantId = restaurant?._id;

  const fetchMenuItems = useCallback(async () => {
    if (loading || !hasMore || !restaurantId) return;

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/menu/restaurant/${restaurantId}?page=${page}&limit=20`;
      const response = await axios.get(url, { withCredentials: true });
      const newItems = response.data?.data?.products || [];
      setMenuItems(prevItems => [...prevItems, ...newItems]);
      setHasMore(newItems.length > 0);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      setMenuItems([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
      const initialFetch = async () => {
        setLoading(true);
        try {
          const url = `${import.meta.env.VITE_SERVER_URL}/api/menu/restaurant/${restaurantId}?page=1&limit=20`;
          const response = await axios.get(url, { withCredentials: true });
          const newItems = response.data?.data?.products || []; 
          console.log(newItems,response);
          setMenuItems(newItems);
          setHasMore(newItems.length > 0);
          setPage(2);
        } catch (error) {
          console.error("Error fetching initial menu items:", error);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      };
      initialFetch();
    }
  }, [restaurantId]);

  const lastMenuItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMenuItems();
      }
    }, { threshold: 0.8 });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMenuItems]);

  if (!restaurantId) {
    return <div className="p-8 text-center text-gray-600">Please select a restaurant to view its menu.</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Menu</h2>
      {menuItems.length === 0 && !loading && !hasMore && (
        <div className="text-center text-gray-600 p-8">No menu items found for this restaurant.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => {
          if (menuItems.length === index + 1) {
            return <div ref={lastMenuItemRef} key={item._id || index}><MenuItemCard item={item} /></div>;
          }
          return <MenuItemCard key={item._id || index} item={item} />;
        })}
        {loading && (
          Array.from({ length: 5 }).map((_, index) => <MenuItemSkeleton key={`skeleton-${index}`} />)
        )}
      </div>

      {!hasMore && menuItems.length > 0 && !loading && (
        <p className="text-center text-gray-600 mt-8">You've reached the end of the menu!</p>
      )}
    </div>
  );
};