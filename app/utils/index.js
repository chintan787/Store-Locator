
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
    console.log('requestBody', mapApiKey ? requestBody : settings)
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
  console.log('shop addstoreDetails', shop, addstoreDetails);
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

export const deleteStore = async ({id, shop}) => {
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
    console.log('delete call', data);
    return (data);

  } catch (error) {
    console.log(error);
  }
}

export const updateStoreDetails = async ({shop,storeDetails}) => {

  try {
   
    const response = await fetch(`${process.env.API_URL}/update-store-location/${storeDetails?.id}?shop=${shop}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "AccesAccess-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(storeDetails),
      });
    const data = await response.json();
    console.log('update',data);
    if (data?.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}