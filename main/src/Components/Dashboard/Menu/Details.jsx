import React, { useState } from "react";
import Login from "../../../asserts/Login.jpg"
const Details = ({item}) => {
  return(
    <>
    <div>
        <div className="p-2 m-2 flex gap-10">
            <div className="w-3/5 p-4 m-6">
              <h1 className="font-bold text-3xl p-2">{item.name}</h1>
              <div className="flex gap-3">
                <span>category:</span>
                <h3>{item.category}</h3>
              </div>
              
              <p className="w-full from-neutral-400 text-slate-600 ">A healthy green gram dosa from Andhra Pradesh.</p>
              <div className="flex gap-4">
                <span>{item.status}</span>
                
              </div>
              <div className="flex gap-3">
                <span>Rating :</span>
                <h3>{item.rating}</h3>
              </div>
              <div className="flex gap-3">
                <span>Price :</span>
                <h3>{item.price}</h3>
              </div>
            </div>
            <div className="w-1/2 p-2">
            <img src={Login} alt="" className="w-3/1 h-3/2 p-4 m-2 "/>
            </div>
        </div>
        
    </div>
    </>
  )
}
export default Details