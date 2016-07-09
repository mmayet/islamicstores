$(document).ready(function() {
    myReadyFunction();
    //startMap();
});

function initMap() {
    map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 11,
    });
    var latLng;
    var shopName;
}


function initializeMap(position) {
    NProgress.set(0.4);
    var userCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    centerMap(position.coords.latitude, position.coords.longitude);

    var image = {
        url: 'images/home.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };
    var marker = new google.maps.Marker({
        position: userCenter,
        map: map,
        title: "Your Location",
        icon: image
    });
}

function escapeText(t) {
    return document.createTextNode(t).textContent;
}

function shopReader(results) {
    for (var i = 0; i <= results.metadata.count; i++) {
        shopName = escapeText(results.features[i].properties.title);
        shopLink = escapeText(results.features[i].properties.url);
        var shop = results.features[i];
        myGetCoordsFunction(i, shopName, shopLink, escapeText(results.features[i].properties.address));
    }
}

function addButtons(lat, lng) {
    $("table").append("<tr><td><button onclick=\"centerMap(" + lat + "," + lng +
        ");\">View this store</button>" +
        "<button>Drive Here</button></td></tr>");
}

function centerMap(lat, lng) {
    NProgress.start();
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    NProgress.done();
}

function myBadLoadFunction(XMLHttpRequest, errorMessage, errorThrown) {
    alert("Load failed:" + errorMessage + ":" + errorThrown);
}

function myReadyFunction() {
    $.ajax({
        url: "js/stores.json",
        dataType: "json",
        success: shopReader,
        error: myBadLoadFunction
    });
}

function myGetCoordsFunction(i, shName, shLink, address) {
    $.ajax({
        //url: "//maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey,
        url: "//maps.googleapis.com/maps/api/geocode/json?address=" + address,
        dataType: "json",
        success: function(data) {
            geodata = data.results[0];

            var lat = geodata.geometry.location.lat;
            var lng = geodata.geometry.location.lng;
            if (i == 0) {
                if (navigator.geolocation) {
                    centerMap(lat, lng);
                    navigator.geolocation.getCurrentPosition(initializeMap);
                } else {
                    centerMap(lat, lng);
                }
            }
            $("table").append("<tr><td><a href='" + shLink + "' target='_blank'>" + shName + "</a></td></tr><tr><td>" +
                "</td></tr>");
            latLng = new google.maps.LatLng(lat, lng);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: shName
            });
            addButtons(lat, lng);

            google.maps.event.addListener(marker, 'click', function() {
                NProgress.start();
                map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                map.setZoom(20);
                map.setTilt(45);
                map.panTo(this.getPosition());
                NProgress.done();
            });
        },
        error: myBadLoadFunction
    });
}

/*function getGeoData(data) {
    geodata = data.results[0];

    var lat = geodata.geometry.location.lat;
    var lng = geodata.geometry.location.lng;
    //if (i == 0) {
        if (navigator.geolocation) {
            centerMap(lat, lng);
            navigator.geolocation.getCurrentPosition(initializeMap);
        } else {
            centerMap(lat, lng);
        }
    //}
    $("table").append("<tr><td><a href='" + shopLink + "' target='_blank'>" + shopName + "</a></td></tr><tr><td>"
            + "</td></tr>");
    latLng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: shopName
    });
    addButtons(lat, lng);

    google.maps.event.addListener(marker, 'click', function () {
        NProgress.start();
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        map.setZoom(20);
        map.setTilt(45);
        map.panTo(this.getPosition());
        NProgress.done();
    });
}*/