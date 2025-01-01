
export const getSettings = async (shop) => {

  try {
    const response = await fetch(`${process.env.API_URL}/get-settings?shop=${shop}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
      });
    const data = await response.json();
    return (data);

  } catch (error) {
    console.log(error);
  }
}

export const updateSetting = async ({ shop, mapApiKey, settings }) => {

  const requestBody = {};
  if (mapApiKey) requestBody.googleMapStyleId = mapApiKey;
  // if (pixelEnable !== undefined) requestBody.is_dsm_pixel_enable = pixelEnable;
  // if (webPixelEnable !== undefined) requestBody.is_web_pixel_enable = webPixelEnable;
  // if (storefront) requestBody.storefront_access_token = storefront;

  try {
   
    const response = await fetch(`${process.env.API_URL}/update-settings?shop=${shop}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(mapApiKey ? requestBody : settings),
      });
    const data = await response.json();
    if (data?.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const addStore = async ({ shop, addstoreDetails }) => {
  console.log('shop addstoreDetails::', shop, addstoreDetails, typeof addstoreDetails);
  try {
    const response = await fetch(`${process.env.API_URL}/create-store-location?shop=${shop}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: addstoreDetails,
    });
    const data = await response.json();
    console.log('added! ', data);
    if (data?.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getStores = async (shop) => {
  try {
    const response = await fetch(`${process.env.API_URL}/get-store-location?shop=${shop}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
      });
    const data = await response.json();
    return (data?.data);

  } catch (error) {
    console.log(error);
  }
}

export const deleteStore = async ({ shop, id }) => {
  try {
    const response = await fetch(`${process.env.API_URL}/delete-store-location/${id}?shop=${shop}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
      });
    const data = await response.json();
    return (data);

  } catch (error) {
    console.log(error);
  }
}

export const updateStoreDetails = async ({ shop, updatedstoreDetails }) => {
  console.log('shop,', shop, updatedstoreDetails, typeof JSON.parse(updatedstoreDetails));
  const updatedData = JSON.parse(updatedstoreDetails);
  try {
    const response = await fetch(`${process.env.API_URL}/update-store-location/${updatedData?.id}?shop=${shop}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
        body: updatedstoreDetails,
      });
    const data = await response.json();
    console.log('update', data);
    if (data?.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getLocation = async (admin) => {

  const response = await admin?.graphql(`
    query {
  locations(first: 5) {
    edges {
      node {
        id
        name
        address {
          formatted
        }
      }
    }
  }
}
    `);

  const data = await response.json();
  const countryName = data?.data?.locations.edges[0]?.node?.address?.formatted[0];
  return (countryName)
}

export const getCoordinates = async (admin) => {
  const country = await getLocation(admin);
  console.log('process.env.GEOCODING_API_KEY', process.env.GEOCODING_API_KEY)
  try {
    if (country) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          country
        )}&key=${process.env.GEOCODING_API_KEY}`
      );

      if (!response.ok) {
        throw new Response("Failed to fetch geolocation data", { status: 500 });
      }

      const data = await response.json();
      const location = data.results[0]?.geometry.location;
      return (location);
    }
  }
  catch (error) {
    console.log(error);
  }

}