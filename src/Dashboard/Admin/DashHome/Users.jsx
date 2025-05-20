import React,{useState,useEffect} from 'react';
import Axios from "axios"
export const Users = () => {
 const [users,setUsers]=useState([])
 useEffect(()=>{
    const url=`${import.meta.env.VITE_SERVER_URL}/api/users`
    Axios.get(url,{withCredentials:true})
    .then((response)=>setUsers(response.data.userDetails))
    .catch((error)=>console.log(error.message))
 },[])
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options).replace(',', '').replace(/ /g, '-');
};
  return (
    <div className="m-3 p-4 bg-white text-black rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <table className="min-w-full text-base border ">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2"><input type="checkbox" /></th>
            <th className="p-2">User ID</th>
            <th className="p-2">User Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Login</th>
            <th className="p-2">Join Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user?._id} className="border-t">
              <td className="p-2"><input type="checkbox" /></td>
              <td className="p-2">{user?._id}</td>
              <td className="p-2">{user?.username}</td>
              <td className="p-2">{user?.email}</td>
              <td className="p-2">{user?.type}</td>
              <td className="p-2">{formatDate(user?.lastLogin)}</td>
            <td className="p-2">{formatDate(user?.createdAt)}</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2">Delete</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs ">Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
