import React ,{useState} from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

export default function MapProviderComponent({apiKey}) {

    console.log("apiKey", apiKey);
  
    const [map, setMap] = useState(null);
    // const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const onLoad = (mapInstance) => {
      setMap(mapInstance);
    };
  
    const mapContainerStyle = {
      width: '100%',
      height: '400px',
    };
  
    const center = {
      lat: -3.745,
      lng: -38.523,
    };
  

  return (
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
        >
          {/* Child components, such as markers, info windows, etc. */}
        </GoogleMap>
      </LoadScript>
  )
}
