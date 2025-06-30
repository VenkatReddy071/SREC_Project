import {useState,useEffect} from "react"
function ProfileBanner({ onEditClick,userData }) {
    const [user,setUser]=useState(null);

    useEffect(()=>{
        if(userData){
            setUser(userData?.username);
        }
    },[userData])
  const initials = user?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6 shadow-lg rounded-b-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-white text-blue-700 flex items-center justify-center text-4xl font-bold uppercase overflow-hidden">
            {initials}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold">{user}</h1>
            <div className="mt-3 text-lg">
              <div><span className="font-semibold">0</span> Reviews</div>
            </div>
          </div>
        </div>
        <button
          onClick={onEditClick}
          className="bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Edit profile
        </button>
      </div>
    </div>
  );
}
export default ProfileBanner;