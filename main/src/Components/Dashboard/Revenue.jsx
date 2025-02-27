import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from "recharts";
  import "./Charts.css";
  

  function Revenue({ active, data,shift,handleChange }) {
    const handle=(data)=>{
      if(data==="week"){
        shift("weekly");
        handleChange("week")
      }
      else if(data==="today"){
        handleChange("today");
        shift("today")
      }
      else{
        shift("monthly");
        handleChange("monthly");
      }
    }
    return (
      <>
        <div className="linechart">
          <div className="top">
            <h1>Revenue</h1>
            <div className="buttons">
              <button
                className={`${active === "monthly" ? "dark" : "white"}`}
                onClick={()=>handle("month")}

              >
                Monthly
              </button>
              <button
                className={`${active === "weekly" ? "dark" : "white"}`}
                onClick={()=>handle("week")}
              >
                Weekly
              </button>
              <button
                className={`${active === "today" ? "dark" : "white"}`}
                onClick={()=>handle("today")}
              >
                Today
              </button>
            </div>
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="legend-box blue"></span> Income
            </div>
            <div className="legend-item">
              <span className="legend-box black"></span> Expenses
            </div>
          </div>
          <ResponsiveContainer className="cart" width="80%" height={300}>
            <LineChart data={data}>
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#1976D2" // Blue color for income
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#000000" // Black color for expenses
                strokeWidth={2}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }
  
  export default Revenue;
  