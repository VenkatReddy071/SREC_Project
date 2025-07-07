import React, { useEffect } from 'react'
import {useNavigate, useSearchParams} from "react-router-dom"
import {DashHomeHospital } from '../Hospital/Home';
export const Type = () => {
  const naviagte=useNavigate();
    const [searchParams]=useSearchParams();
    const type=searchParams.get("");
    console.log(type);
    useEffect(()=>{
      if(type){
        naviagte(type);
      }
    },[])
  return (
    <div></div>
  )
}
