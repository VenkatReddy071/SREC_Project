import { useState } from "react"
import "./Charts.css"
import Revenue from "./Revenue"
import OrdersSummary from "./Summary"
import Orders from "./Orders"
import ShowData from "./ShowData"
import Review from "./Review"
import Users from "./Users"
function ChartsInfo(){
    const monthly=()=>[
        { name: "Jan", income: 20000, expenses: 15000 },
        { name: "Feb", income: 22000, expenses: 16000 },
        { name: "Mar", income: 25000, expenses: 20000 },
        { name: "Apr", income: 30000, expenses: 25000 },
        { name: "May", income: 35000, expenses: 28000 },
    ]
    const weekly=()=>[
        { name: "Mon", income: 3000, expenses: 2500 },
        { name: "Tue", income: 3200, expenses: 2700 },
        { name: "Wed", income: 3500, expenses: 3000 },
        { name: "Thu", income: 4000, expenses: 3500 },
        { name: "Fri", income: 4500, expenses: 4000 },
    ]
    const dataToday = [
        { name: "9 AM", income: 1000, expenses: 700 },
        { name: "12 PM", income: 2000, expenses: 1500 },
        { name: "3 PM", income: 3000, expenses: 2000 },
        { name: "6 PM", income: 4000, expenses: 3000 },
        { name: "9 PM", income: 5000, expenses: 4000 },
      ];
      const [data,setData]=useState(monthly);
      const [active,setActive]=useState("monthly");

      const handleMonth=(type)=>{
        if(type==="monthly"){
            setData(monthly)
        }
        else if(type==="week"){
            setData(weekly)
        }
        else{
            setData(dataToday)
        }
      }
    return(
        <>
            <div>
                <div className="div-content">
                        <Revenue active={active} data={data} shift={setActive} handleChange={handleMonth}/>
                        <Revenue active={active} data={data} shift={setActive} handleChange={handleMonth}/>
                </div>
                <div className="orders-info">
                    <Orders/>
                    <ShowData/>
                    <Review/>
                    <Users/>
                </div>
            </div>
        </>
    )
}
export default ChartsInfo