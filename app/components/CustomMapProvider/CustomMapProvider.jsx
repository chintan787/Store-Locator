import React from 'react';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';
// import MovingMarker from './MovingMarker';
// import MarkerWithInfowindow from './MarkerWithInfowindow';
// import {ControlPanel} from './ControlPanel';

export default function CustomMapProvider({ apiKey, shopLocation, showMarker = false }) {
  console.log('showMarker', showMarker)
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };
  console.log('shopLocation', shopLocation)


  return (
    <>

      <Map
        // mapId={'bf51a910020fa25a'}
        style={mapContainerStyle}
        defaultZoom={6}
        defaultCenter={shopLocation}
        gestureHandling={'greedy'}
        disableDefaultUI>
        {showMarker && (
          <Marker
            position={{ lat: shopLocation?.lat, lng: shopLocation?.lng }}
            clickable={true}
            onClick={() => console.log('Worked!!')}
            title={"hello"}
          />
        )}
      </Map>


    </>
  )
}
