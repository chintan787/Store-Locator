

// var searchData = "";

// // Array of locations
// var locations = [
//     { id: 1, name: 'Store 1', location: { lat: 22.311577152592353, lng: 70.8072549380415 }, city: "Rajkot" },
//     { id: 2, name: 'Store 2', location: { lat: 23.031101621466604, lng: 72.56295010873404 }, city: "Ahmedabad" },
//     { id: 3, name: 'Store 3', location: { lat: 22.721363614152715, lng: 75.8566197420204 }, city: "Indore" },
//     { id: 4, name: 'Store 4', location: { lat: 19.081339098664024, lng: 72.87492221187017 }, city: "Mumbai" },
//     { id: 5, name: 'Store 5', location: { lat: 33.75213458616814, lng: 75.6755794676045 }, city: "Jammu and Kashmir" },
//     { id: 6, name: 'Store 6', location: { lat: 30.300512104800816, lng: 75.13057496975424 }, city: "Punjab" },
//     { id: 7, name: 'Store 7', location: { lat: 28.694415014702, lng: 77.21630107809408 }, city: "New Delhi" },
//     { id: 8, name: 'Store 8', location: { lat: 25.593771968407847, lng: 85.13308125379646 }, city: "Patna" },
//     { id: 9, name: 'Store 9', location: { lat: 48.85879070761603, lng: 2.294453272896295 }, city: "Eiffel Tower" },
//     // { id: 10, name: 'Store 10', location: { lat: 39.51266056515189, lng: -103.11139894555814 }, city: "United States" },

// ];
// var filterData = locations

// function handleSearchValue(event) {
//     const searchValue = event.target.value;
//     searchData = searchValue
//     console.log('Search value changed:', searchValue);

//     const val = locations.filter(store =>
//         store?.city?.toLowerCase().includes(searchValue?.toLowerCase())
//     )
//     console.log("val", val)
//     filterData = val
//     sidebarInit()
// }

// function initMap() {
//     // The location you want to center your map on
//     var myLatLng = { lat: -25.363, lng: 131.044 };

//     // Create a map object and specify the DOM element for display.
//     var map = new google.maps.Map(document.getElementById('custom-storeLocator'), {
//         // center: myLatLng,
//         zoom: 4
//     });

//     var infowindow = new google.maps.InfoWindow();
//     var markers = [];
//     var bounds = new google.maps.LatLngBounds();

//     // Loop through the locations and add markers
//     locations.forEach(function (item) {
//         var marker = new google.maps.Marker({
//             map: map,
//             position: { lat: item.location.lat, lng: item.location.lng },
//             title: item.city
//         });
//         markers.push(marker);
//         bounds.extend(marker.position);
//         // Add click event listener to the marker to open an info window
//         marker.addListener('click', function () {
//             infowindow.setContent('<div><h2>' + item.name + '</h2><p>Some information about ' + item.city + '</p></div>');
//             infowindow.open(map, marker);
//         });

//         // Add item to the sidebar
//         // var sidebar = document.getElementById('sidebar-container');
//         // console.log("sidebar", sidebar)
//         // var sidebarItem = document.createElement('div');
//         // sidebarItem.className = 'sidebar-item';
//         // sidebarItem.innerHTML = '<div><img src="https://i.ibb.co/2NJ9kRT/map-pin-svgrepo-com.png" /> </div> <div><h3>' + item.name + '</h3><p>' + item.city + '</p></div>';
//         // sidebarItem.addEventListener('click', function () {
//         //     infowindow.setContent('<div><h2>' + item.name + '</h2><p>Some information about ' + item.city + '</p></div>');
//         //     infowindow.open(map, marker);
//         //     map.setCenter(marker.getPosition());
//         // });
//         // sidebar.appendChild(sidebarItem);
//     });
//     map.fitBounds(bounds);

//     // Get the user's current location
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             var userLocation = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             // Create a custom marker for the user's location
//             var userMarker = new google.maps.Marker({
//                 map: map,
//                 position: userLocation,
//                 title: 'Your Location',
//                 icon: {
//                     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Custom marker icon
//                 }
//             });

//             // Center the map on the user's location
//             console.log("userLocation", userLocation)
//             map.setCenter(userLocation);

//             // Extend the bounds to include the user's location
//             bounds.extend(userMarker.position);
//             map.fitBounds(bounds);
//         }, function () {
//             // Handle error
//             console.log('Error: The Geolocation service failed.');
//         });
//     } else {
//         // Browser doesn't support Geolocation
//         console.log('Error: Your browser doesn\'t support geolocation.');
//     }

// }

// // Load the Google Maps API script dynamically
// function loadGoogleMaps() {
//     var script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFlPehgw95jQld8kzBrmQ_dELOtFRUk6o&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);
// }

// document.addEventListener('DOMContentLoaded', function () {
//     loadGoogleMaps();
// });

// function generateHTML(filterData) {
//     console.log("filterData",filterData)
//     const data =
//         `<div class="sidebarContainer">
//         <div class="serachContainer">
//     <img src="https://i.ibb.co/n6vbx3Q/menu-svgrepo-com.png" height="25px" width="25px" alt="menu-svgrepo-com" border="0" />
//     <input type="text" placeholder="search here"  oninput="handleSearchValue(event)"  />
//       <img src="https://i.ibb.co/F6Yzw4G/search-svgrepo-com-1.png" height="25px" width="25px" alt="search-svgrepo-com-1" border="0" />
//     </div>
//     <div class="sidebar-container">
//         ${filterData?.map(item =>

//             `<div class="sidebar-item">
//                 <div>
//                 <img src="https://i.ibb.co/2NJ9kRT/map-pin-svgrepo-com.png" />
//                 </div>
//                 <div>
//                 <h3>${item.name}</h3>
//                 <p>${item.city}</p>
//                 </div>
//             </div>`
//         ).join("")}
//     </div>
//     </div>
//     `

//     return data
// }

// var sidebarInit = async function () {
//     console.log("Default call",filterData)
//     const htmlContent = await generateHTML(filterData)
//     console.log("hrml",htmlContent)
//     const container = document.getElementById('sidebar')
//     // console.log("container",container)
//     container.innerHTML = htmlContent;
// }
// sidebarInit();






// function handleSearchValue(event) {
//     const searchValue = event.target.value;
//     searchData = searchValue;

//     filterData = locations.filter(store =>
//         store.city.toLowerCase().includes(searchValue.toLowerCase())
//     );

//     updateSidebar();
//     // updateMapMarkers();
// }

// function handleRangeValue(event) {
//     rangeValue = event.target.value;
//     document.getElementById('rangeValue').textContent = rangeValue;
//     filterLocations();
//   }