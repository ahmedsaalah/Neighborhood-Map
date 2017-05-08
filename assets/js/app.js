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
                latlong: "31.2141829, 29.9199581",
                latlon: "lat=31.2141829&lon=29.9199581",


                category: "restaurant", // category for search fiel
                status: ko.observable("OK"), // change status if error message received from Yelp
                type: "food"

            },
            {
                id: 1,
                title: "Kbab hamdy ",
                location: new google.maps.LatLng(31.2589367, 29.98013),
                latlong: "31.2589367, 29.98013",

                latlon: "lat=31.2589367&lon=29.98013",


                category: "restaurant",

                status: ko.observable("OK"),
                type: "food"

            },
            {
                id: 2,
                title: "Abou shosha",
                latlong: "31.2577232, 29.9813115",
                latlon: "lat=31.2577232&lon=29.9813115",
                location: new google.maps.LatLng(31.2577232, 29.9813115),


                category: "coffee",

                status: ko.observable("OK"),
                type: "juice"

            },
            {
                id: 3,
                title: "Home",
                location: new google.maps.LatLng(31.2590232, 29.986692),

                latlong: "31.2590232, 29.986692",
                latlon: "lat=31.2590232&lon=29.986692",

                category: "home",

                status: ko.observable("OK"),
                type: "home"

            },
            {
                id: 4,
                title: "Talaat ",
                location: new google.maps.LatLng(31.2026314, 29.8840698),

                latlong: "31.2026314, 29.8840698",
                latlon: "lat=31.2026314&lon=29.8840698",

                category: "Juice Bar",

                status: ko.observable("OK"),
                type: "juice"
            },
            {
                id: 5,
                title: "el falah",
                location: new google.maps.LatLng(31.1968273, 29.9057599),

                latlong: "31.1968273, 29.9057599",
                latlon: "lat=31.1968273&lon=29.9057599",

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




        certainMarkers(arrayResults, map);

        return arrayResults;

    }, this);

    markersModel.clickHandler = function(data) {

        marker = markers[data.id]

        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);


        map.setZoom(20);
        map.setCenter(marker.getPosition());
        var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ab2be4f78cbc26981e3fe484038ad122&accuracy=16&' + place.latlon + '&format=json';
        //  console.log(flickrUrl);
        var photos;
        $.ajax({
            url: flickrUrl,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function(data) {

                var photo = data.photos.photo;
                var flickrJSON = photo;
                var number = Math.floor((Math.random() * 250) + 1);

                var photos = 'https://farm' + flickrJSON[number].farm + '.staticflickr.com/' + flickrJSON[number].server + '/' + flickrJSON[number].id + '_' + flickrJSON[number].secret + '.jpg';


                infowindow.setContent('<img src="' + photos +
                    '" alt="Street View Image of "' + place.location + '"><br/><hr style="margin-bottom: 5px"><strong>' +
                    place.location + '</strong><br><p>');



            },
            error: function() {
                infowindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.title + "</div>");

                alert("Sorry!Flickr Images Could Not Be Loaded.");

            }
        });



        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.

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

function certainMarkers(places, map) {
    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: pyrmont,
    //     zoom: 20
    // });


    var bounds = new google.maps.LatLngBounds();



    var len = markers.length;
    for (var i = 0; i < len; i++) {
        markers[i].setMap(null);

    }


    var len = markers.length;
    for (var i = 0; i < len; i++) {
        if (i == places.length) {
            break;
        }

        var place = places[i];

        markers[place.id].setMap(map);



        bounds.extend(place.location);

    }
    map.fitBounds(bounds);




}


function createMarkers(places, map) {


    var len = markers.length;
    for (var i = 0; i < len; i++) {
        markers[i].setMap(null);

    }


    var bounds = new google.maps.LatLngBounds();



    for (var i = 0; i < places.length; i++) {
        place = places[i];

        var marker = new google.maps.Marker({
            map: map,
            name: place.title,

            position: place.location
        });

        markers.push(marker);

        bounds.extend(place.location);

        var pic = "https://maps.googleapis.com/maps/api/streetview?size=180x90&location=" + place.latlong + "&fov=75&heading=3&pitch=10 ";




        (function(marker, place) {
            google.maps.event.addListener(marker, "click", function(e) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2100);

                map.setZoom(20);
                map.setCenter(marker.getPosition());

                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.


                infowindow.setContent('<img src="' + pic +
                    '" alt="Street View Image of "' + place.title + '"><br><br/><hr style="margin-bottom: 5px"><strong>' +
                    place.title + '</strong><br><p>'


                );
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