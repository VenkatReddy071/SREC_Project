import { useNavigate } from "react-router-dom";
function SideNav({ activeTab, setActiveTab, tabs }) {
  const navigate=useNavigate();
  const handleClick=(tab)=>{
     setActiveTab(tab?.name);
     navigate(tab?.link)
  }
  return (
    <nav className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
      {Object.entries(tabs).map(([category, items]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h3 className="text-gray-600 font-bold text-sm uppercase tracking-wide mb-3">{category}</h3>
          <ul>
            {items.map((tab) => (
              <li key={tab?.name}>
                <button
                  onClick={() =>handleClick(tab)}
                  className={`block w-full text-left py-2 px-4 rounded-md transition duration-150 ease-in-out
                    ${activeTab === tab?.name
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                  {tab?.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
export default SideNav;