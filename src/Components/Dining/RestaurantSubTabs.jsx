import {useState,useRef,useEffect} from "react"
export const RestaurantSubTabs = ({ activeTab, onTabChange,setIsSidebarOpen }) => {
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const offset = tabsRef.current.offsetTop;
        setIsSticky(window.scrollY > offset - 100); // 100px buffer for header
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { key: 'all', label: 'All Restaurants' },
    { key: 'takeaway', label: 'Takeaway' },
    { key: 'tiffins', label: 'Only Tiffins' },
  ];

  return (
    <div
      ref={tabsRef}
      className={`sticky top-0  z-10 bg-white shadow-md rounded-md px-10`}
    >
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
      <div className="max-w-7xl mx-auto py-3 px-4 flex justify-between flex-wrap gap-2 md:gap-4">
                <div>
                  {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-2 ml-4 rounded-full text-lg font-medium transition-colors duration-300 font-['Inter'] shadow-sm
              ${activeTab === tab.key
                ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
                </div>
    
                <button
                onClick={() => setIsSidebarOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center"
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v1a1 1 0 002 0V4zM11 4a1 1 0 00-2 0v1a1 1 0 002 0V4zM16 4a1 1 0 00-2 0v1a1 1 0 002 0V4zM5 9a1 1 0 00-2 0v1a1 1 0 002 0V9zM11 9a1 1 0 00-2 0v1a1 1 0 002 0V9zM16 9a1 1 0 00-2 0v1a1 1 0 002 0V9zM5 14a1 1 0 00-2 0v1a1 1 0 002 0v-1zM11 14a1 1 0 00-2 0v1a1 1 0 002 0v-1zM16 14a1 1 0 00-2 0v1a1 1 0 002 0v-1z"></path></svg>
                Filters
            </button>
        

      </div>
    </div>
  );
};