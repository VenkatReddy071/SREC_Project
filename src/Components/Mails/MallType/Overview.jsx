import React, { useState,useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import PopularProductCard from "./ProductDetails"
L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

const isCurrentlyOpen = (operatingHours, globalClosed) => {
    if (globalClosed) {
        return { status: 'Temporarily Closed', isOpen: false };
    }

    const now = new Date();
    const currentDayName = getDayName(now);
    const todayHours = operatingHours?.find(h => h.day === currentDayName);

    if (!todayHours) {
        return { status: 'Hours Not Available', isOpen: false };
    }

    if (todayHours.isClosed) {
        return { status: 'Closed Today', isOpen: false };
    }

    const [openHour, openMinute] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.closeTime.split(':').map(Number);

    const openTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openHour, openMinute, 0);
    let closeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closeHour, closeMinute, 0);

    if (closeTime < openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
    }

    if (now >= openTime && now < closeTime) {
        return { status: 'Open Now', isOpen: true };
    } else {
        return { status: 'Closed Now', isOpen: false };
    }
};

export const MallOverviewContent = ({ hospital,product }) => {
    if (!hospital) {
        return (
            <div className="p-8 text-center text-gray-600">
                Loading mall details...
            </div>
        );
    }
    const { status: currentOperationalStatus, isOpen: isRestaurantOpen } = isCurrentlyOpen(hospital.operatingHours, hospital.closed);
    const currentDayName = getDayName(new Date());
    const [productData,setProductData]=useState();
    useEffect(() => {
          window.scrollTo(0, '50');
        }, []);
    useEffect(()=>{
        if(product){
        setProductData(product);
        }
        console.log(product);
    },[product])
    return (
        <div className="p-4 sm:p-8 bg-white text-gray-800 md:w-full">
            <section className="mb-8">
                <h2 className="text-4xl font-extrabold text-blue-700 mb-2">{hospital.name}</h2>
                <p className="text-xl text-blue-500 mb-4">{hospital.info}</p>
                <span className={`ml-4 absolute -top-4 md:top-4 right-4  text-sm md:text-xl  font-semibold px-2.5 md:py-0.5 rounded-full ${isRestaurantOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {currentOperationalStatus}
                </span>
                <div className="flex items-center text-lg text-gray-700">
                    <span className="text-yellow-500 text-2xl">{'★'.repeat(Math.floor(hospital.rating))}</span>
                    <span className="text-gray-300 text-2xl">{'★'.repeat(5 - Math.floor(hospital.rating))}</span>
                    <span className="ml-2 font-medium">{hospital.rating.toFixed(1)} Stars</span>
                </div>
            </section>
            <section className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 md:w-full">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">Quick Information & Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-700 font-semibold mb-1">Location:</p>
                        <p className="text-gray-600">{hospital.address}, {hospital.locationName}, {hospital.area}</p>
                        {hospital.pincode && <p className="text-gray-600">Pincode: {hospital.pincode}</p>}
                    </div>
                    <div>
                        <p className="text-gray-700 font-semibold mb-1">Contact:</p>
                        <p className="text-blue-600 hover:underline"><a href={`tel:${hospital.phoneNumber}`}>{hospital.phoneNumber}</a></p>
                        <p className="text-blue-600 hover:underline"><a href={`mailto:${hospital.email}`}>{hospital.email}</a></p>
                        {hospital.website && <p className="text-blue-600 hover:underline"><a href={hospital.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>}
                    </div>
                    <div>
                        <p className="text-gray-700 font-semibold mb-1">Mall Type:</p>
                        <p className="text-gray-600">{hospital.mallType.join(', ')}</p>
                    </div>
                    
                </div>

                <div className="mt-6 border-t border-blue-200 pt-4">
                    <p className="text-gray-700 font-semibold mb-2">Key Features:</p>
                    <ul className="list-disc list-inside text-gray-600 grid grid-cols-1 sm:grid-cols-2">
                        {hospital.amenities && hospital.amenities.map((amenity, index) => (
                            <li key={index} className="flex items-center">
                                <span className="text-blue-500 mr-2">&#10003;</span> {amenity}
                            </li>
                        ))}
                        {hospital.hasWeddingShopping && (
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">&#10003;</span> Wedding Shopping Available
                            </li>
                        )}
                        {hospital.offersAvailable && (
                            <li className="flex items-center">
                                <span className="text-blue-500 mr-2">&#10003;</span> Exciting Offers Available!
                            </li>
                        )}
                    </ul>
                </div>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Operating Hours</h2>
                        <ul className="list-none p-0 space-y-1">
                            {hospital.operatingHours && hospital.operatingHours.length > 0 ? (
                                hospital.operatingHours.map((dayHours, index) => (
                                    <li key={index} className={`flex justify-between py-1 ${dayHours.day === currentDayName ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                                        <span>{dayHours.day}:</span>
                                        {dayHours.isClosed ? (
                                            <span className="text-red-500">Closed</span>
                                        ) : (
                                            <span>{dayHours.openTime} - {dayHours.closeTime}</span>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">Operating hours not specified.</li>
                            )}
                        </ul>
                    </div>
            <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-6">Popular Products & Stores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productData?.map(product => (
                        <PopularProductCard key={product._id} product={product} mall={hospital}/>
                    ))}
                </div>
            </section>


            {/* Image Gallery */}
            {hospital.gallery && hospital.gallery.length > 0 && (
                <section className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-700 mb-6">Mall Gallery</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hospital.gallery.map((imgUrl, index) => (
                            <GalleryImage key={index} imgUrl={imgUrl} index={index} />
                        ))}
                    </div>
                </section>
            )}

            {/* Map Integration */}
            {hospital.coordinates?.latitude != null && hospital.coordinates?.longitude != null ? (
                <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Location Map</h3>
                    <div className="w-full h-64 rounded-lg overflow-hidden border border-blue-100">
                        <MapContainer
                            center={[hospital.coordinates.latitude, hospital.coordinates.longitude]}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="w-full h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[hospital.coordinates.latitude, hospital.coordinates.longitude]}>
                                <Popup>
                                    {hospital.name} <br /> {hospital.address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    {hospital.nearByLocations && hospital.nearByLocations.length > 0 && (
                        <p className="mt-4 text-gray-600">
                            **Nearby Locations:** {hospital.nearByLocations.join(', ')}
                        </p>
                    )}
                </section>
            ) : (
                <section className="mb-8 p-6 bg-white rounded-lg border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">Location Map</h3>
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 border border-blue-100">
                        <p>Map coordinates not available.</p>
                    </div>
                </section>
            )}
        </div>
    );
};



const GalleryImage = ({ imgUrl, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-blue-100">
            {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
            <img
                src={imgUrl}
                alt={`Mall Gallery Image ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg ${imageLoaded ? '' : 'hidden'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/d3d3d3/424242?text=Gallery+Error"; setImageLoaded(true); }}
            />
        </div>
    );
};
