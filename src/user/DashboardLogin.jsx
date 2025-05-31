import React, { useState } from 'react';
import ForgetPassword from "./ForgetPassword"
import { useNavigate } from 'react-router-dom';
import Axios from "axios"
export default function DashboardLogin() {
    const naviagte=useNavigate();
    const [dashboardType, setDashboardType] = useState('admin');
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [open,setOpen]=useState(false);
    const handleDashboardChange = (e) => {
        setDashboardType(e.target.value);
    };

    const handleDashboardLogin=()=>{
        const url=`${import.meta.env.VITE_SERVER_URL}/api/dashboard`
        console.log(email,password)
        Axios.post(url,{email,password},{withCredentials:true})
        .then((response)=>{
            naviagte(`/dashboard/type?=${response.data?.url}`)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {!open?
            <>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{dashboardType} Dashboard Login</h2>
                <div className="mb-4">
                    <label htmlFor="dashboard" className="block text-sm font-medium text-gray-600">Select Dashboard</label>
                    <select
                        id="dashboard"
                        value={dashboardType}
                        onChange={handleDashboardChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="admin">Admin</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="college">College</option>
                        <option value="school">School</option>
                        <option value="shopping">Fashion</option>
                    </select>
                </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={()=>handleDashboardLogin()}
                    >
                        Login
                    </button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Forgot Password? <h1 className="text-blue-600 hover:underline cursor-pointer" onClick={()=>setOpen(true)}>Reset it here</h1>
                    </p>
                </div>
            </div>
            </>:
            <>
            <ForgetPassword setOpen={setOpen}/>
            </>}
        </div>
    );
}
