import React, { useState } from 'react';
import "./Order.css"
function Orders() {
  const [orders, setOrders] = useState([
    {
      No: 1,
      id: "121dd",
      customerName: 'John Doe',
      location: 'New York',
      amount: 150,
      status: 'Completed'
    },
    {  
      No: 2,
      id: "2ss",
      customerName: 'Jane Smith',
      location: 'Los Angeles',
      amount: 200,
      status: 'Pending'
    },
    {   
      No: 3,
      id: "3dd",
      customerName: 'Mike Johnson',
      location: 'Chicago',
      amount: 120,
      status: 'Cancelled'
    },
    {
      No: 4,
      id: "4ddss",
      customerName: 'Emily Davis',
      location: 'Houston',
      amount: 180,
      status: 'Completed'
    }
  ]);

  return (
    <>
      <div className="orders">
        <div className="div-table">
          <h1>Order List</h1>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td>{item.No}</td>
                  <td>{item.id}</td>
                  <td>{item.customerName}</td>
                  <td>{item.location}</td>
                  <td>{item.amount}</td>
                  <td className={
                    item.status === 'Completed' ? 'completed' :
                    item.status === 'Pending' ? 'pending' :
                    'cancelled'
                  }>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Orders;
