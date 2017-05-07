// --------- MODEL ---------------

function model() {
    var markersModel = {
        markers: [{

                title: "Alban Swesra",
                location: new google.maps.LatLng(31.2141829, 29.9199581),


                category: "restaurant", // category for search fiel
                status: ko.observable("OK"), // change status if error message received from Yelp
                type: "food"

            },
            {

                title: "Kbab hamdy ",
                location: new google.maps.LatLng(31.2589367, 29.98013),


                category: "restaurant",

                status: ko.observable("OK"),
                type: "food"

            },
            {
                title: "Abou shosha",
                location: new google.maps.LatLng(31.2577232, 29.9813115),


                category: "coffee",

                status: ko.observable("OK"),
                type: "juice"

            },
            {
                title: "Home",
                location: new google.maps.LatLng(31.2590232, 29.986692),


                category: "home",

                status: ko.observable("OK"),
                type: "home"

            },
            {
                title: "Talaat ",
                location: new google.maps.LatLng(31.2026314, 29.8840698),


                category: "Juice Bar",

                status: ko.observable("OK"),
                type: "juice"
            },
            {
                title: "el falah",
                location: new google.maps.LatLng(31.1968273, 29.9057599),


                category: "restaurant",

                status: ko.observable("OK"),
                type: "food"

            }
        ]
    };
    return markersModel;
}

function viewmodel(marker) {
    markersModel = marker;
    markersModel.Query = ko.observable('');

    markersModel.searchResults = markersModel.markers.slice();
    console.log(markersModel.searchResults.length)
    markersModel.searchResults = ko.computed(function() {

        var q = markersModel.Query();
        return markersModel.markers.filter(function(i) {
            return i.title.toLowerCase().indexOf(q) >= 0;
        });

    });


    return markersModel;
}

function initMap(markersModel) {
    var pyrmont = new google.maps.LatLng(31.2001, 29.9187);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 20
    });
    var request = {
        location: pyrmont,
        radius: '500',
        types: ['store']
    };

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            createMarkers(markersModel.searchResults, map, infowindow, pyrmont);
        } else {
            console.log("heeeey you")
        }
    });


}


function createMarkers(places, map, infowindow, myPosition) {

    var bounds = new google.maps.LatLngBounds();
    markers = [];

    var placesList = document.getElementById('places');
    console.log(places.length);
    for (var i = 0; i < places.length; i++) {
        place = places[i];

        var marker = new google.maps.Marker({
            map: map,
            name: place.title,

            position: place.location
        });


        bounds.extend(place.location);


        (function(marker, place) {
            google.maps.event.addListener(marker, "click", function(e) {
                map.setZoom(20);
                map.setCenter(marker.getPosition());
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                infowindow.setContent("<div style = 'width:200px;min-height:40px'>" + place.title + "</div>");
                infowindow.open(map, marker);
            });
        })(marker, place);


    }
    map.fitBounds(bounds);

}

function start() {
    markersModel = model();
    markersModel = viewmodel(markersModel);


    console.log(markersModel.searchResults.le)
    initMap(markersModel);
    ko.applyBindings(markersModel);

}

function errorHandling() {
    alert("Google Maps has failed to load. Please check your internet connection and try again.");
}