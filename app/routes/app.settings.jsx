import { BlockStack, Box, Button, Card, Grid, InlineStack, Page, Text, TextField, Select, RadioButton } from '@shopify/polaris'
import React, { useState, useEffect } from 'react';
// import ImageUploading from 'react-images-uploading';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';


export default function SettingPage() {

    const iconData = [
        { id: 1, mapIcon: './images/blue.png', dataIcon: './images/blueb.png', color: 'blue' },
        { id: 2, mapIcon: './images/chikni.png', dataIcon: './images/chiknib.png', color: 'chikni' },
        { id: 3, mapIcon: './images/green.png', dataIcon: './images/greenb.png', color: 'green' },
        { id: 4, mapIcon: './images/greeni.png', dataIcon: './images/greenib.png', color: 'greeni' },
        { id: 5, mapIcon: './images/greenio.png', dataIcon: './images/greeniob.png', color: 'greenio' },
        { id: 6, mapIcon: './images/orange.png', dataIcon: './images/orangeb.png', color: 'orange' },
        { id: 7, mapIcon: './images/purple.png', dataIcon: './images/purpleb.png', color: 'purple' },
        { id: 8, mapIcon: './images/red.png', dataIcon: './images/redb.png', color: 'red' },
        { id: 9, mapIcon: './images/skyblue.png', dataIcon: './images/skyblueb.png', color: 'skyblue' },
        { id: 10, mapIcon: './images/yellow.png', dataIcon: './images/yellowb.png', color: 'yellow' },
        // { id: 11, mapIcon: './images/yellow.png', dataIcon: './images/yellowb.png' },
    ]
    const mapStyleData = [
        { id: 1, map: './images/staticmap2.jpg', type: 'Standard' },
        { id: 2, map: './images/staticmap6.jpg', type: 'Silver' },
        { id: 3, map: './images/staticmap4.jpg', type: 'Retro' },
        { id: 4, map: './images/staticmap.jpg', type: 'Dark' },
        { id: 5, map: './images/staticmap3.jpg', type: 'Night' },
        { id: 6, map: './images/staticmap5.jpg', type: 'Aubergine' },
    ]
    const mapLayoutData = [
        { id: 1, map: './images/left.jpg', type: 'left' },
        { id: 2, map: './images/right.jpg', type: 'right' },
        { id: 3, map: './images/left_top_1.jpg', type: 'lefttop' },
        { id: 4, map: './images/right_top_1.jpg', type: 'righttop' },
    ]
    const [currentIconSelected, setCurrentIconSelected] = useState(iconData[0]?.color);

    const [currentSetting, setCurrentSetting] = useState(
        //     {
        //     iconColor: 'blue',
        //     radius: 20,
        //     radiusUnits: 0,
        //     searchRadiusLabel: 'search Radius',
        //     mapSearch: '',
        //     defaultLocation: '',
        //     zoom: 8,
        //     storeListingType: '',
        //     googleMapStyleId: '',
        //     mapStyle: 'Standard',
        //     mapLayout: 'left',
        // }
    );
    const [shopName, setShopName] = useState();

    const radiusUnitsOptions = [
        { label: "Km", value: "km" },
        { label: "m", value: "m" },
    ]
    const mapSearchOption = [
        { label: "Location", value: "Location" },
        { label: "store_name", value: "Name" },

    ]
    const storeListingTypeOption = [
        { label: "Alphabetical", value: "alphabetical" },
        { label: "Neares to far", value: "neartofar" },
    ]

    const handleCurrentVal = async (name, item) => {
        console.log("item.color", item)
        console.log("item.color", name)
        setCurrentSetting({ ...currentSetting, [name]: item });

        // setCurrentIconSelected(e.target.value)
    }
    const handleSettingChange = async (e, id) => {
        console.log('check',{ ...currentSetting, [id]: e })
        // if (id === 'iconColor') {
        //     setCurrentSetting({ ...currentSetting, [id]: e, customIcon: '' });

        // } else {
            setCurrentSetting({ ...currentSetting, [id]: e });

        // }
    }
    const handlemarkerIcon = async (val, val2, id) => {
        console.log('check', val, val2, id)
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
    }, [shopName])


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

    const updateSettings = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSetting)
        };

        try {
            const response = await fetch(`https://apps.strokeinfotech.com/store-locator/update-settings?shop=quickstart-820001e2.myshopify.com`, requestOptions);
            const data = await response.json();
            handleGetSettings();
        } catch (error) {
            console.log(error);
        }
    }

    // const [images, setImages] = React.useState([]);
    // const maxNumber = 69;

    // const onChange = (imageList, addUpdateIndex) => {
    //   // data for submit
    //   console.log(imageList, addUpdateIndex);
    //   setImages(imageList);
    // };

    return (
        <Page fullWidth>
            <BlockStack gap="500">
                <Card padding={{ xs: '400', sm: '500', md: '600' }} style={[styles.card,]}>
                    <Text >Map Icon Color</Text>

                    <Box style={{ display: 'flex', alignItems: 'center', gap: 16, }}>
                        <Box style={styles.boxContainer}>
                            {iconData?.map((item) =>
                                <Box key={item.id} style={currentSetting?.iconColor === item?.color ? styles.boxItemHighlighted : styles.boxItem} id="iconColor"
                                    onClick={(e) => handleSettingChange(item?.color, "iconColor",)}
                                // onClick={(e) => handlemarkerIcon(item?.mapIcon, item?.dataIcon, "iconColor",)}

                                >
                                    <Box style={styles.boxContent} background="bg-fill-info">
                                        <img src={item.mapIcon} style={styles.images} alt={item.color} />
                                        <img src={item.dataIcon} style={styles.images} alt={item.color} />
                                    </Box>
                                </Box>
                            )}

                        </Box>
                        <Box style={{ width: '10%', height: '100%', maxHeight: 150, }}>
                            <Box style={styles.uploadImageBoxItem} id="iconColor" >
                                <ImageUpload setCurrentSetting={setCurrentSetting} currentSetting={currentSetting} />
                            </Box>
                        </Box>
                    </Box>
                </Card>

                <Card padding={{ xs: '400', sm: '500', md: '600' }} style={styles.card}>

                    <Grid columns={{ sm: 3 }}>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}
                        >
                            <Box>
                                <TextField
                                    label="Default Radius" value={currentSetting?.radius}
                                    type='number'
                                    name="radius"
                                    onChange={handleSettingChange}
                                    id="radius"
                                    placeholder="Enter Radius"
                                    autoComplete="off" />
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}
                        >
                            <Box>
                                <Select
                                    label="Radius Units"
                                    options={radiusUnitsOptions}
                                    onChange={handleSettingChange}
                                    // value={selectedPostSpacing}
                                    value={currentSetting?.radiusUnits}
                                    id="radiusUnits"
                                />
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}
                        >
                            <Box>
                                <TextField
                                    label="Search Radius Label"
                                    value={currentSetting?.searchRadiusLabel}
                                    name="searchRadiusLabel"
                                    onChange={handleSettingChange}
                                    id="searchRadiusLabel"
                                    placeholder="Search Radius"
                                    autoComplete="off" />
                            </Box>
                        </Grid.Cell>

                    </Grid>
                </Card>


                <Card padding={{ xs: '400', sm: '500', md: '600' }} style={styles.card}>
                    <Grid columns={{ sm: 3 }}>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }}
                        >
                            <Box>
                                <Select
                                    label="Map Search"
                                    options={mapSearchOption}
                                    onChange={handleSettingChange}
                                    // value={selectedPostSpacing}
                                    value={currentSetting?.mapSearch}
                                    id="mapSearch"
                                />
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }}
                        >
                            <Box>
                                <TextField
                                    label="Default Location" value={currentSetting?.defaultLocation}
                                    name="defaultLocation"
                                    onChange={handleSettingChange}
                                    id="defaultLocation"
                                    placeholder="Enter Default Map Location "
                                    autoComplete="off" />
                            </Box>

                        </Grid.Cell>
                        <Grid.Cell
                            columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }}
                        >
                            <Box>
                                <TextField
                                    label="Default Zoom Level"
                                    value={currentSetting?.zoom}
                                    type='number'
                                    name="zoom"
                                    onChange={handleSettingChange}
                                    id="zoom"
                                    placeholder="Search Radius"
                                    autoComplete="off" />
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }}>
                            <Box>
                                <Select
                                    label="Store Listing type"
                                    options={storeListingTypeOption}
                                    onChange={handleSettingChange}
                                    // value={selectedPostSpacing}
                                    value={currentSetting?.storeListingType}
                                    id="storeListingType"
                                />
                            </Box>
                        </Grid.Cell>

                    </Grid>
                </Card>

                <Card padding={{ xs: '400', sm: '500', md: '600' }} style={styles.card}>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
                            <Box>
                                <TextField
                                    label="Google Style MAP ID"
                                    placeholder='Enter Google Style MAP ID'
                                    name="googleMapStyleId" id="googleMapStyleId"
                                    value={currentSetting?.googleMapStyleId}
                                    onChange={handleSettingChange}
                                />
                            </Box>
                        </Grid.Cell>
                    </Grid>
                    <Box style={styles.mapStyleContainer}>
                        <Text>Map Style</Text>
                        <Grid columns={6}>
                            {mapStyleData?.map((item) =>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 2 }} key={item.id} >
                                    <div className="custom-radio" onClick={() => handleSettingChange(item?.type, 'mapStyle')} key={item.id} >
                                        <input
                                            type="radio"
                                            id={item?.type}
                                            name="options"
                                            checked={currentSetting?.mapStyle === item?.type}
                                            onChange={() => { }}
                                            style={{ display: 'none' }}
                                        />
                                        <img src={item.map} alt={item.type} className={currentSetting?.mapStyle === item.type ? 'selected' : ''} />
                                    </div>
                                </Grid.Cell>
                            )}
                        </Grid>
                    </Box>
                </Card>

                <Card padding={{ xs: '400', sm: '500', md: '600' }} style={styles.card}>
                    <Text >Map Layout Style</Text>
                    <Grid columns={6}>
                        {mapLayoutData.map((item) =>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }} key={item.id} >
                                <div className="custom-radio" onClick={() => handleSettingChange(item.type, "mapLayout")} key={item.id} >
                                    <input
                                        type="radio"
                                        id={item.type}
                                        name="options"
                                        checked={currentSetting?.mapLayout === item.type}
                                        onChange={() => { }}
                                        style={{ display: 'none' }}
                                    />
                                    <img src={item.map} alt={item.type} className={currentSetting?.mapLayout === item.type ? 'selected' : ''} />
                                </div>
                            </Grid.Cell>
                        )}
                    </Grid>

                    {/* <Grid columns={6}>
                        {mapLayoutData.map((item) =>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 3, xl: 3 }} key={item.id} >
                                <Box key={item.id} onClick={() => handleCurrentVal("mapLayout", item.type)}>
                                    <img src={item.map} height='100%' width="100%" />
                                    <Text alignment='center'>{item.type}</Text>
                                </Box>
                            </Grid.Cell>
                        )}
                    </Grid> */}
                </Card>
                <Box style={{ maxWidth: 350, margin: '0 auto' }}>
                    <Button size='large' textAlign='center' variant='primary' onClick={updateSettings}>Save</Button>
                </Box>

            </BlockStack>

            <style jsx>{`
        .custom-radio img {
          cursor: pointer;
          border: 2px solid transparent;
          transition: border 0.2s ease-in-out;
          width:100%;
          height:100%;
        }

        .custom-radio img.selected {
          border: 2px solid #5c6ac4; /* Highlight the selected image */
        }
      `}</style>
        </Page>
    )
}


const styles = {
    card: {
        borderRadius: '3px'
        // padding: 6
    },
    boxContainer: {
        display: 'flex',
        flexWrap: "wrap",
        gap: 16,
        margin: "14px 0",
        width: '90%'
    },
    boxItem: {
        flex: '1 1 6%',
        maxWidth: '100%',
        minWidth: 'auto',
        border: '1px solid #ccc',
        mrgin: '0 aoto',
        justifyContent: 'center'
    },
    boxItemHighlighted: {
        flex: '1 1 6%',
        maxWidth: '100%',
        minWidth: 'auto',
        border: '2px solid #5c6ac4',
        mrgin: '0 aoto',
        justifyContent: 'center'
    },
    boxContent: {
        position: 'relative',
        width: '100%',
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 0',
        backgroundColor: '#f4f6f8',
        borderRadius: '3px',
        cursor: 'pointer',
        gap: 4
    },
    images: {
        height: 20
    },
    mapStyleContainer: {
        padding: "14px 0"
    },
    mapStyleRadio: {
        position: 'absolute',
        opacity: 0,
        cursor: 'pointer',
        left: 0,
        right: 0,
        width: '100%',
        margin: 0,
        top: 0,
        bottom: 0,
        height: '100%'
    },
    uploadImageBoxItem: {
        height: '100%',
        border: '2px dashed #dfe3e8',
        mrgin: '0 aoto',
        justifyContent: 'center',
        borderRadius: 3,
        // padding: 8
    }
}