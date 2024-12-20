

var locations = [
    { id: 1, name: 'Store 1', location: { lat: 22.311577152592353, lng: 70.8072549380415 }, city: "Rajkot" },
    { id: 2, name: 'Store 2', location: { lat: 23.031101621466604, lng: 72.56295010873404 }, city: "Ahmedabad" },
    { id: 3, name: 'Store 3', location: { lat: 22.721363614152715, lng: 75.8566197420204 }, city: "Indore" },
    { id: 4, name: 'Store 4', location: { lat: 19.081339098664024, lng: 72.87492221187017 }, city: "Mumbai" },
    { id: 5, name: 'Store 5', location: { lat: 33.75213458616814, lng: 75.6755794676045 }, city: "Jammu and Kashmir" },
    { id: 6, name: 'Store 6', location: { lat: 30.300512104800816, lng: 75.13057496975424 }, city: "Punjab" },
    { id: 7, name: 'Store 7', location: { lat: 28.694415014702, lng: 77.21630107809408 }, city: "New Delhi" },
    { id: 8, name: 'Store 8', location: { lat: 25.593771968407847, lng: 85.13308125379646 }, city: "Patna" },
    // { id: 9, name: 'Store 9', location: { lat: 48.85879070761603, lng: 2.294453272896295 }, city: "Eiffel Tower" }
];

var searchData = "";
var filterData = locations;
var currentValue = "500";
var userLocation


function handleSearchValue(event) {
    searchData = event.target.value;
    filterLocations();
}

function handleRangeValue(event) {
    rangeValue = event.target.value;
    document.getElementById('rangeValue').textContent = rangeValue;
    filterLocations();
}

function filterLocations() {
    filterData = locations.filter(store =>
        store.city.toLowerCase().includes(searchData.toLowerCase()) &&
        calculateDistance(userLocation.lat, userLocation.lng, store.location.lat, store.location.lng) <= rangeValue
    );
    updateMapMarkers();
    updateSidebar();

    // console.log("user==", userLocation)
    // filterData = locations.filter(store =>
    //     store.city.toLowerCase().includes(searchData.toLowerCase()) &&
    //     calculateDistance(userLocation.lat, userLocation.lng, store.location.lat, store.location.lng) <= rangeValue
    // );
    // updateSidebar();
    // updateMapMarkers();
}

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log("r", R * c)
    return R * c;


    // Placeholder function to calculate distance
    // Replace with actual distance calculation if needed
    // return Math.random() * 500; // Random value for demonstration
}


var map;
var markers = [];
var infowindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('custom-storeLocator'), {
        zoom: 4,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ['roadmap', 'satellite', 'terrain', 'hybrid']
        },
        mapTypeId: 'roadmap' 

    });

    infowindow = new google.maps.InfoWindow();

    updateMapMarkers();
    updateSidebar();
    // radiusBar();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var userMarker = new google.maps.Marker({
                map: map,
                position: userLocation,
                title: 'Your Location',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
            });
            console.log("user", userLocation)

            map.setCenter(userLocation);
            // bounds.extend(userMarker.position);
            // map.fitBounds(bounds);
        }, function () {
            console.log('Error: The Geolocation service failed.');
        });
    } else {
        console.log('Error: Your browser doesn\'t support geolocation.');
    }
}

function updateMapMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    var bounds = new google.maps.LatLngBounds();

    filterData.forEach(function (item) {
        var marker = new google.maps.Marker({
            map: map,
            position: { lat: item.location.lat, lng: item.location.lng },
            title: item.city
        });
        markers.push(marker);
        bounds.extend(marker.position);

        marker.addListener('click', function () {
            infowindow.setContent('<div><h2>' + item.name + '</h2><p>Some information about ' + item.city + '</p></div>');
            infowindow.open(map, marker);
        });
    });

    map.fitBounds(bounds);
}


function openInfoWindow(index) {
    console.log("click",index)
    const marker = markers[index];
    const item = filterData[index];
    infowindow.setContent('<div><h2>' + item.name + '</h2><p>Some information about ' + item.city + '</p></div>');
    infowindow.open(map, marker);
    map.setCenter(marker.getPosition());
}


function updateSidebar() {
    const container = document.getElementById('sidebar-container');
    container.innerHTML = filterData.map((item, index) => `
      <div class="sidebar-item" onclick="openInfoWindow(${index})">
        <div><img src="https://i.ibb.co/2NJ9kRT/map-pin-svgrepo-com.png" /></div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.city}</p>
        </div>
      </div>
    `).join('');
}


// function radiusBar() {
//     const container = document.getElementsByClassName('mapTypeSection');
//     container[0].innerHTML = `<div  class="progressBarsection">
//           <label>Search Radius:</label> <p>${currentValue}km</p>
//       </div>
//       <input
//           type="range"
//           min="0"
//           max="8000"
//           value=${currentValue}
//           onchange="setCurrentValue(e.target.value)"
//           class="progressBar"
//       />`
// }

function updateSidebar() {
    const container = document.getElementById('sidebar-container');
    container.innerHTML = filterData.map(item => `
      <div class="sidebar-item">
        <div><img src="https://i.ibb.co/2NJ9kRT/map-pin-svgrepo-com.png" /></div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.city}</p>
        </div>
      </div>
    `).join('');
}

function loadGoogleMaps() {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFlPehgw95jQld8kzBrmQ_dELOtFRUk6o&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function () {
    loadGoogleMaps();
});