import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

L.Icon.Default.prototype._get='https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg'
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export const Map = ({ lat, long, address }) => {
  const [coordinates, setCoordinates] = useState(null);

  const openCageApiKey = "2fe6302d9d304ad5bf5520116c8f75ad";

  const fetchCoordinates = async (addr) => {
    if (!addr || addr.trim() === "") {
      setCoordinates(null);
      return;
    }

    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      addr
    )}&key=${openCageApiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setCoordinates({ lat, lng });
      } else {
        console.warn("Coordinates not found for this address:", addr);
        setCoordinates(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setCoordinates(null);
    }
  };

  useEffect(() => {
    fetchCoordinates(address);
  }, [address]);

  function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      if (center[0] && center[1]) {
        map.setView(center, zoom);
      }
    }, [center, zoom, map]);
    return null;
  }

  const defaultPosition = [43.654652, -79.380934];
  const mapCenter = coordinates ? [coordinates.lat, coordinates.lng] : (lat && long ? [lat, long] : defaultPosition);

  return (
    <div className="mt-4 h-96 bg-gray-200 rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={mapCenter} zoom={15} />

        {coordinates || (lat && long) ? (
          <Marker position={mapCenter}>
            <Popup>{address || `Lat: ${mapCenter[0]}, Lng: ${mapCenter[1]}`}</Popup>
          </Marker>
        ) : null}
      </MapContainer>
    </div>
  );
};