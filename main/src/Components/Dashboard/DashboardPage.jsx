import StatCard from "./StatCart"
import "./Stat.css"
import { LuSquareMenu } from "react-icons/lu";
import { IoBagHandleOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { FaChartBar } from "react-icons/fa";
import ChartsInfo from "./ChartsInfo"
function DashboardPage(){
    return(
        <>
            <div className="dashboard-section">
                <div className="carts-info">
                <StatCard title="Total Menus" value="120" progress={45} color="rgba(194, 191, 191, 0.6)" icon={<LuSquareMenu/>}/>
                <StatCard title="Total Orders Today" value="180" progress={62} color="#9F86C0" icon={<IoBagHandleOutline/>}/>
                <StatCard title="Total Clients Today" value="240" progress={80} color="#F6CACA" icon={<BsPeople/>}/>
                <StatCard title="Revenue Day Ratio" value="140" progress={85} color="#00A8E8" icon={<FaChartBar/>}/>
                </div>

                <div className="Section-bars">
                    <ChartsInfo/>
                </div>
            </div>
        </>
    )
}
export default DashboardPage