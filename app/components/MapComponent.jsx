
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader, InfoWindow, useLoadScript, Circle } from '@react-google-maps/api';
import { geocode, fromAddress, setDefaults } from 'react-geocode';
import {
    Page,
    Text,
    Card,
    Button,
    BlockStack,
    Box,
    Select, Grid,
    TextField, IndexTable, Layout, useSetIndexFiltersMode, ChoiceList, Badge, useIndexResourceState, IndexFilters,
    Icon, FormLayout, LegacyCard, Form,
    Tabs,
    InlineStack, DropZone, Thumbnail, LegacyStack,
    InlineError
} from "@shopify/polaris";
import './customAppStyle.css';

import {
    SearchIcon,
} from '@shopify/polaris-icons';


export default function MapComponent({ handleStoreValues, storeDetails, setstoreDetails, setIsShowStoreDetails, isEdit, setCurrentTab, setIsEdit, currentStorePosition }) {

    const [mapRef, setMapRef] = useState();
    const [mapType, setMapType] = useState('roadmap');
    // const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [storePosition, setStorePosition] = useState();
    const [isclickCoordinates, setISClickCoordinates] = useState(false);
    const [isLoading, setIsLocading] = useState(false);
    const containerStyle = {
        width: '100%',
        height: '400px',
    };
    console.log('currentStorePosition',currentStorePosition)
    // const center = {
    //     lat: 22.977, lng: 78.644
    //     // lat: -3.745,
    //     // lng: -38.523,
    // };

    const { isLoaded } = useJsApiLoader({
        // googleMapsApiKey: '2c54e68e43134d7f' // Add your API key here
        googleMapsApiKey: 'AIzaSyAFlPehgw95jQld8kzBrmQ_dELOtFRUk6o',
        mapIds: ['2c54e68e43134d7f']

    });

    useEffect(() => {
        if (isEdit) {
            if (storeDetails.latitude && storeDetails.longitute) {
                setISClickCoordinates(true);
                setStorePosition({ lat: Number(storeDetails?.latitude), lng: Number(storeDetails?.longitute) })
            }
        }
    }, [isEdit]);



    setDefaults({
        key: "AIzaSyAFlPehgw95jQld8kzBrmQ_dELOtFRUk6o", // Your API key here.
        language: "en",
        region: "es",
    });


    const onMapLoad = (map) => {
        setMapRef(map);
        // const geocodeFunction = async (activity) => {
        //     console.log("activity", activity)
        //     await fromAddress(activity.city)
        //         .then(({ results }) => {
        //             console.log("Res", results)
        //             const { lat, lng } = results[0].geometry.location;
        //             console.log(lat, lng);
        //             // setCenter({ lat: lat, lng: lng })
        //         })
        //         .catch(console.error);
        // }
        // const geocodeActivities = async () => {
        //     // await geocodeFunction(stores[0])
        // }
        // geocodeActivities();
    };


    const handleAllValues = async () => {
        console.log("storeDetails", storeDetails);
        setIsLocading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storeDetails)
        };
        try {
            const response = await fetch(`https://apps.strokeinfotech.com/store-locator/create-store-location?shop=quickstart-820001e2.myshopify.com`, requestOptions);
            const data = await response.json();
            console.log('data', data);
            setIsShowStoreDetails(false);
            setCurrentTab(0);
            setstoreDetails(null);
            setIsLocading(false);
        } catch (error) {
            console.log(error);
        }

    }

    const updateStoreDetails = async () => {
        console.log("storeDetails", storeDetails);
        setIsLocading(true);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storeDetails)
        };

        try {
            const response = await fetch(`https://apps.strokeinfotech.com/store-locator/update-store-location/${storeDetails?.id}?shop=quickstart-820001e2.myshopify.com`, requestOptions);
            const data = await response.json();
            console.log('data', data);
            setIsShowStoreDetails(false);
            setCurrentTab(0);
            setIsEdit(!isEdit);
            setstoreDetails(null);
            setIsLocading(false);
        } catch (error) {
            console.log(error);
        }
    }
    const showMarkerPosition = () => {
        setStorePosition({ lat: Number(storeDetails?.latitude), lng: Number(storeDetails?.longitute) })
    }

    useState(() => {
        console.log("storePosition", storePosition)
        console.log("storePosition", storePosition?.latitude)
        console.log("storePosition", typeof storePosition?.latitude)
        console.log("22.721363614152715", typeof 22.721363614152715)

    }, [storePosition])


    return (

        <BlockStack gap="400">
            <Text as="h2">Adjust Store Location</Text>
            <InlineStack>
                <Button icon={SearchIcon}>Find My Store</Button>

            </InlineStack>
            <Text as="p">
                Clicking on the 'Find My Store' button will roughly estimate your store's location. You can then move the pointer to the correct position or click on a different area on the map to place it in a more appropriate location if required.
            </Text>
            <InlineStack gap={400}>
                <Button onClick={() => setISClickCoordinates(true)}>I Know my coordinates</Button>
                {isclickCoordinates && (
                    <InlineStack gap={400}>
                        <TextField
                            placeholder="Enter Latitude"
                            name="latitude"
                            id="latitude"
                            value={storeDetails?.latitude}
                            onChange={handleStoreValues}

                        />
                        <TextField
                            placeholder="Enter Longitute"
                            name="longitute"
                            id="longitute"
                            value={storeDetails?.longitute}
                            onChange={handleStoreValues}

                        />
                        <Button onClick={showMarkerPosition}>Update Location</Button>
                    </InlineStack>
                )}
            </InlineStack>

            {isLoaded ?
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={storePosition ? currentStorePosition : ''}
                    zoom={6}
                    mapTypeId={mapType}
                    onLoad={onMapLoad}

                    options={{
                        disableDefaultUI: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        mapTypeId: mapType,
                    }}

                >
                    {/* <Marker
                        position={{lat:20.823129077159784, lng:71.038433845}}
                        icon={{ url: "/map-marker-svgrepo-com.svg" }}
                    />
                       <Marker
                        position={{ lat: 22.721363614152715, lng: 75.8566197420204 }}
                        icon={{ url: "/map-marker-svgrepo-com.svg" }}
                    /> */}
                    {storePosition !== undefined ? (
                        <Marker position={storePosition ? storePosition : ''} icon={{ url: '/map-marker-svgrepo-com.svg' }} />
                    ) : ''}
                </GoogleMap>
                : ''}

            <InlineStack align="end" gap="400">
                <Button onClick={() => setCurrentTab(0)}>Previous</Button>
                <Button variant="primary" loading={isLoading } onClick={isEdit ? updateStoreDetails : handleAllValues}>{isEdit ? "Update Changes" : "Save Changes"}</Button>
            </InlineStack>

        </BlockStack>

    )

}