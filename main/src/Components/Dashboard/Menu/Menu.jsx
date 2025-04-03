import { useState } from "react";
import  Overview  from "./Overview";
export const Menu = () => {
  const [item,setItem]=useState(null);
  const menu = [
    "Pesarattu",
    "Ponganalu",
    "Uggani with Mirapakaya Bajji",
    "Idli",
    "Dosa",
    "Rayalaseema Biryani",
    "Pulihora (Tamarind Rice)",
    "Gutti Vankaya Curry",
    "Chicken Curry",
    "Mutton Fry",
    "Filter Coffee",
    "Masala Chai",
    "Butter Milk",
    "Lassi",
    "Boorelu",
    "Bobbatlu",
    "Ariselu",
    "Chekkalu",
    "Mysore Pak",
  ];
  const handleItem=(name)=>{
    setItem(name);
    console.log(name)
  }
  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Left Menu Section */}
        <div className="w-1/3 p-4 overflow-y-scroll max-h-[500px] border border-gray-200 rounded-lg shadow-md">
          <h1 className="text-center text-2xl font-bold border-b-4 pb-2 mb-4">Menu List</h1>
          <span className="text-sm text-gray-500">Click an item for an overview</span>
          {menu.map((item, index) => (
            <div
              className="w-full p-2 mb-2 shadow-sm border border-gray-100 rounded-lg flex justify-between items-center"
              key={index}
            >
              <h4 className="text-base font-semibold" onClick={(e)=>handleItem(item)}>{item}</h4>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  Edit
                </button>
                <button className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Info Section */}
        <div className="w-full p-0 overflow-y-scroll border border-gray-200 rounded-lg shadow-md max-h-[500px]">
          <Overview item={item}/>
        </div>
      </div>
    </div>
  );
};
