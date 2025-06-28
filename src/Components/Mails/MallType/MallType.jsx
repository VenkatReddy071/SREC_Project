
import React,{useState,useEffect}from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import {Showcase} from "../../../Pages/Showcase/Showcase"
import {MallOverviewContent} from "./Overview"
import {MallAboutContent} from "./About"
import ProductCard from "./Product"
import ViewProduct from './ViewProduct';
const MallType=()=>{
    const [product,setProduct]=useState('');
    const location=useLocation();
    const url=new URLSearchParams(location.search);
    const type=url.get("type");
    console.log(type?.split("/"));
    const mail=type?.split("/");
    const mailId=mail.length >=2 ?mail[2]:null;
    const [mall,setMall]=useState('');
    const service3=mail.length >=3 ?mail[3]:null;
    useEffect(()=>{
        const url=`${import.meta.env.VITE_SERVER_URL}/api/malls/${mailId}`
        axios.get(url,{withCredentails:true})
        .then((response)=>{
            console.log(response.data);
            setMall(response.data?.mall);
        })
        .catch((error)=>{
            console.log(error);
            alert("error while fetching");
        })
        fetch();
    },[mailId])
    const fetch=()=>{
        const url=`${import.meta.env.VITE_SERVER_URL}/api/product/popular/${mailId}`
        axios.get(url,{withCredentials:true})
        .then((response)=>{
          console.log(response.data);
            setProduct(response.data.product);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    const getInitialActiveNavLink = () => {
    if (mail && mail.length > 3) {
      const urlSegment = mail[3];
      return urlSegment;
    }
    return "Overview";
  };
  const [activeNavLink, setActiveNavLink] = useState(getInitialActiveNavLink);
  const defaultNavLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Products', id: 'products' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'AboutUs', id: 'about_us' },
    {label:'viewProduct',id:'view_product'},
  ];
  useEffect(()=>{
    setActiveNavLink(service3);
  },[service3])

  const renderContent = () => {
      switch (activeNavLink) {
        case 'Overview':
          return <MallOverviewContent hospital={mall} product={product}/>;
        case 'AboutUs':
          return <MallAboutContent hospital={mall}/>;
        case 'Products':
          return <ProductCard mallId={mailId} mall={mall}/>;
        case 'viewProduct':
          return <ViewProduct defaultProduct={product[0]}/>;
        default:
          return <MallOverviewContent hospital={mall} />;
      }
    };
    return(
          <div>
              <Showcase
                defaultNavLinks={defaultNavLinks}
                activeNavLink={activeNavLink}
                setActiveNavLink={setActiveNavLink}
                hospital={mall}
              />
              <div className="relative content-area min-h-[500px] md:flex md:items-center  md:mx-10">
                {renderContent()}
              </div>
            </div>
    )
}

export default MallType