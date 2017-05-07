// --------- MODEL ---------------
var markersModel = [];
var pyrmont;

var infowindow;
var service;


var markers = [];

function model() {
    markersModel = {
        markers: [{
                id: 0,
                title: "Alban Swesra",
                location: new google.maps.LatLng(31.2141829, 29.9199581),


                category: "restaurant", // category for search fiel
                status: ko.observable("OK"), // change status if error message received from Yelp
                type: "food"

            },
            {
                id: 1,
                title: "Kbab hamdy ",
                location: new google.maps.LatLng(31.2589367, 29.98013),


                category: "restaurant",

                status: ko.observable("OK"),
                type: "food"

            },
            {
                id: 2,
                title: "Abou shosha",
                location: new google.maps.LatLng(31.2577232, 29.9813115),


                category: "coffee",

                status: ko.observable("OK"),
                type: "juice"

            },
            {
                id: 3,
                title: "Home",
                location: new google.maps.LatLng(31.2590232, 29.986692),


                category: "home",

                status: ko.observable("OK"),
                type: "home"

            },
            {
                id: 4,
                title: "Talaat ",
                location: new google.maps.LatLng(31.2026314, 29.8840698),


                category: "Juice Bar",

                status: ko.observable("OK"),
                type: "juice"
            },
            {
                id: 5,
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


function viewmodel(marker, map) {



    markersModel = marker;
    markersModel.Query = ko.observable('');



    var arrayResults = [];
    markersModel.searchResults = ko.computed(function() {


        var arrayResults = [];
        arrayResults = $.grep(markersModel.markers, function(a) {
            var titleSearch = a.title.toLowerCase().indexOf(markersModel.Query().toLowerCase());
            var catSearch = a.category.toLowerCase().indexOf(markersModel.Query().toLowerCase());


            return (titleSearch > -1 || catSearch > -1);
        });




        createMarkers(arrayResults, map);

        return arrayResults;

    }, this);

    markersModel.clickHandler = function(data) {

        marker = markers[data.id]


        map.setZoom(20);
        map.setCenter(marker.getPosition());
        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
        infowindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.title + "</div>");
        infowindow.open(map, marker);
    };



    return markersModel;
}

function initMap(markersModel, map) {
    pyrmont = new google.maps.LatLng(31.2001, 29.9187);

    var request = {
        location: pyrmont,
        radius: '500',
        types: ['store']
    };

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

            createMarkers(markersModel.markers, map);
        } else {
            alert("Google Maps has failed to load.");
        }
    });


}


function createMarkers(places, map) {


    var len = markers.length;
    for (var i = 0; i < len; i++) {
        markers[i].setMap(null);

    }


    var bounds = new google.maps.LatLngBounds();


    var placesList = document.getElementById('places');

    for (var i = 0; i < places.length; i++) {
        place = places[i];

        var marker = new google.maps.Marker({
            map: map,
            name: place.title,

            position: place.location
        });

        markers.push(marker);

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
    var map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 20
    });

    markersModel = model();
    markersModel = viewmodel(markersModel, map);



    initMap(markersModel, map);

    ko.applyBindings(markersModel);

}

function errorHandling() {
    alert("Google Maps has failed to load. Please check your internet connection and try again.");
}