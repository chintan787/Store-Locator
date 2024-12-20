import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  Select, Grid,
  TextField,
} from "@shopify/polaris";
import '../components/customAppStyle.css';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { geocode, fromAddress, setDefaults } from 'react-geocode';
import axios from 'axios';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

// export async function loader() {
// const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
// console.log('shopifyAccessToken',shopifyAccessToken)
//   try {
//     const response = await fetch('https://your-store.myshopify.com/admin/api/2023-07/locations.json', {
//       headers: {
//         'X-Shopify-Access-Token': shopifyAccessToken,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch store locations");
//     }

//     const data = await response.json();
//     return json(data.locations);
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     throw new Response("Error fetching locations", { status: 500 });
//   }
// }

const MapComponent = async ({ apiKey }) => {
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


  // const locationss = useLoaderData();
  // console.log('locationss',locationss);

  // const [locations, setLocations] = useState([]);

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       const response = await axios.get('/api/locations');
  //       setLocations(response.data);
  //     } catch (error) {
  //       console.error("Error fetching store locations:", error);
  //     }
  //   };
  //   fetchLocations();
  // }, []);


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
  );
};

export default function MapProvider() {


  // const [stores, setStores] = useState([
  //     { id: 1, name: 'Store 1', location: { lat: 22.311577152592353, lng: 70.8072549380415 }, city: "Rajkot" },
  //     { id: 2, name: 'Store 2', location: { lat: 23.031101621466604, lng: 72.56295010873404 }, city: "Ahmedabad" },
  //     { id: 3, name: 'Store 3', location: { lat: 22.721363614152715, lng: 75.8566197420204 }, city: "Indore" },
  //     { id: 4, name: 'Store 4', location: { lat: 19.081339098664024, lng: 72.87492221187017 }, city: "Mumbai" },
  //     { id: 5, name: 'Store 5', location: { lat: 33.75213458616814, lng: 75.6755794676045 }, city: "Jammu and Kashmir" },
  //     { id: 6, name: 'Store 6', location: { lat: 30.300512104800816, lng: 75.13057496975424 }, city: "Punjab" },
  //     { id: 7, name: 'Store 7', location: { lat: 28.694415014702, lng: 77.21630107809408 }, city: "New Delhi" },
  //     { id: 8, name: 'Store 8', location: { lat: 25.593771968407847, lng: 85.13308125379646 }, city: "Patna" },
  //     { id: 9, name: 'Store 9', location: { lat: 48.85879070761603, lng: 2.294453272896295 }, city: "Eiffel Tower" },
  //   ]);

  const [typeselected, setTypeSelected] = useState('google');
  const [storeKey, setStoreKey] = useState('');
  const [mapApiKey, setMapApiKey] = useState('');
  const [shopName, setShopName] = useState();
  const [currentSetting, setCurrentSetting] = useState();
  const handleSelectChange = useCallback(
    (value) => setTypeSelected(value),
    [],
  );
  // const options = [
  //   { label: 'Google', value: 'google' },
  //   { label: 'MapBox', value: 'mapbox' },
  // ];

  const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopifyStore = process.env.SHOPIFY_STORE;
  console.log('shopifyAccessToken', shopifyAccessToken, shopifyStore)
  const handleGetSettings = async () => {
    fetch(`https://apps.strokeinfotech.com/store-locator/get-settings?shop=quickstart-820001e2.myshopify.com`, {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCurrentSetting(data)
        console.log('data', data);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const shopifyStoreUrl = queryParams.get('shop');
    setShopName(shopifyStoreUrl);
  }, [])
  useEffect(() => {
    if (shopName) {
      handleGetSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopName]);

  const updateMapAPIKEY = async () => {
    console.log("call")
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentSetting)
    };

    try {
      const response = await fetch(`https://apps.strokeinfotech.com/store-locator/update-settings?shop=quickstart-820001e2.myshopify.com`, requestOptions);
      const data = await response.json();
      console.log("res", response)
      handleGetSettings();
    } catch (error) {
      console.log(error);
    }
  }



  const handleGoogleMapApiKey = (e) => {
    console.log('Google Map API Key', e)
    setStoreKey(e);
    setCurrentSetting({ ...currentSetting, googleMapStyleId: e, });
  }
  useEffect(()=>{ console.log('mapApiKey') },[mapApiKey])

  const handleSave = () => {
    console.log('storekey', storeKey)
    setMapApiKey(storeKey);
    updateMapAPIKEY();

  }

  return (
    <Page fullWidth>
      <BlockStack gap="500">
        <Card >
          <BlockStack gap="500">
            {/* <Text variant="headingMd" as="h3">Your Map Provider</Text> */}
            <Text variant="headingMd" as="h3">Google Map Provider</Text>

            {/* <Box as="div" width="10%">
                <Select
                  options={options}
                  onChange={handleSelectChange}
                  value={typeselected}
                />
              </Box> */}
            {/* and MapBox */}
            <Text as="p" style={{ padding: 10 }}>The <b>Store Locator App</b> is using 3rd party mapping provider Google Maps. Because that map is on your website, publicly available, and your customer uses it freely, you'll have to your relationship with the mapping provider. It involves creating an account with them and generating an API key linked to your map and site.</Text>
          </BlockStack>
        </Card>

        <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}>
          <Grid.Cell >
            <Card>
              <BlockStack gap="300" >
                <Text variant="headingMd" as="h4">Google Map API Key</Text>
                <TextField
                  type="text"
                  id="googlemapapikey"
                  placeholder="Enter Google MAP API Key"
                  value={storeKey}
                  // value={mapApiKey}
                  // onChange={(e) => handleGoogleMapApiKey(e)}
                onChange={(e) => setMapApiKey(e)}
                />
                {/* {isMapApiKeySet && isLoaded && (
                  <Box>

                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={center}
                      zoom={6}
                      mapTypeId={mapType}
                      onLoad={onMapLoad}
                    />

                  </Box>
                )} */}
                {mapApiKey && <MapComponent apiKey={mapApiKey} />}
                {/* <Box>
                    <Text as="h3"><b>28,000 map loads or searches free each month.</b></Text>
                    <Text as="p"><i>Requires billing info to get API Key.</i></Text>
                  </Box> */}

              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Box width="50%">
          <Button variant="primary" onClick={handleSave} >SAVE</Button>

        </Box>
      </BlockStack>
    </Page>
  )
}


const styles = {
  para: {
    padding: '10px 0'
  }
}