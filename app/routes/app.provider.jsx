import { Page, Box, Text, BlockStack, Button, Card, Grid, TextField } from '@shopify/polaris'
import React, { useState, useEffect } from 'react';
import MapProviderComponent from '../components/MapProviderComponent';
import { getCoordinates, getLocation, updateSetting } from '../utils';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useOutletContext } from "react-router-dom";
import { authenticate } from '../shopify.server';
import { json } from "@remix-run/node";
import CustomMapProvider from '../components/CustomMapProvider/CustomMapProvider';

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  if (!session?.shop) {
    throw new Error("Missing session or shop data");
  }
  let shopLocation;
  if (admin) {
    shopLocation = await getCoordinates(admin);
    console.log("res",typeof shopLocation.lat);

  }
  return json({ shopLocation })
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const shop = formData.get("shop");
    const mapApiKey = formData.get("apiKey");

    if (shop && mapApiKey) {
      const isUpdated = await updateSetting({ shop, mapApiKey });
      return { success: true, isUpdated };
    }
    return { success: false, message: "Failed to save data" }; // Example response
  } catch (error) {
    console.error("Error in action:", error);
    return { success: false, message: "Failed to save data" }; // Return an error response
  }
}

export default function ProviderPage() {

  const { shop, settings } = useOutletContext();
  const { shopLocation } = useLoaderData();
  
  const fetcher = useFetcher();
  const [mapApiKey, setMapApiKey] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    console.log('shop', shop, settings);
    if (settings?.googlemapapikey) {
      setMapApiKey(settings?.googlemapapikey);
      setShowMap(!showMap);
    }
  }, [settings])



  const handleSave = async () => {
    if (mapApiKey && settings?.googlemapapikey !== "") {
      setShowMap(!showMap);
      const formData = new FormData();
      formData.append("shop", shop); // Corrected this line
      formData.append("apiKey", mapApiKey); // Corrected this line
      fetcher.submit(formData, { method: "post", action: "/app/provider" });
    }
    else {
      setShowMap(!showMap);
    }
  };

  const handleGoogleMapApiKey = (e) => {
    setMapApiKey(e);
  }

  return (
    <Page fullWidth>
      <BlockStack gap="500">

        <Card >
          <BlockStack gap="500">
            <Text variant="headingMd" as="h3">Google Map Provider</Text>

            {/* <Box as="div" width="10%">
//                 <Select
//                   options={options}
//                   onChange={handleSelectChange}
//                   value={typeselected}
//                 />
//               </Box> */}
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
                  value={mapApiKey}
                  onChange={(e) => handleGoogleMapApiKey(e)}
                />
                {/* {showMap && <MapProviderComponent apiKey={mapApiKey} shopLocation={shopLocation}  />} */}
                {showMap && <CustomMapProvider apiKey={mapApiKey} shopLocation={shopLocation}  />}
                {/* <Box>
                    <Text as="h3"><b>28,000 map loads or searches free each month.</b></Text>
                    <Text as="p"><i>Requires billing info to get API Key.</i></Text>
                  </Box> */}

              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Box width="50%">
          <Button size='large' variant="primary" onClick={handleSave} loading={fetcher.state === "loading"}>SAVE</Button>

        </Box>
      </BlockStack>
    </Page>
  )
}
