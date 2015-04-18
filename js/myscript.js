$(document).ready(function() {
  myReadyFunction();
  startMap();
});

function startMap() {
    map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 6,
    });
    var latLng;
    var storeName;
}


function initializeMap(position) {
    NProgress.set(0.4);
    var userCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //map.setCenter(userCenter);
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

function escapeText(t){
  return document.createTextNode(t).textContent;
}

function quakeReader(results) {
    var time = new Date(new Date().getTime());
    if (results.metadata.count == 0) {
        $(".lastUpdated").append("<br/> No recent stores logged by USGS.");
        NProgress.done();
    }
    else {
        for (var i = 0; i <= results.metadata.count; i++) {
            var store = results.features[i].properties;
            storeName = escapeText(store.name);
            storeSite = escapeText(store.url);
            
            var coords = store.geometry.coordinates;
            if (i == 0) {
                if (navigator.geolocation) {
                    centerMap(coords[1], coords[0]);
                    navigator.geolocation.getCurrentPosition(initializeMap);
                } else {
                    centerMap(coords[1], coords[0]);
                }
            }
            $("table").append("<tr class='store "+store.category+"'><td><a href='" + storeSite + "' target='_blank'>" + storeName + "</a></td></tr>");
            latLng = new google.maps.LatLng(coords[1], coords[0]);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: storeName
            });
            addButtons(coords[1], coords[0], store.category);
            addFilterCheckBox(store.category);

            google.maps.event.addListener(marker, 'click', function () {
                NProgress.start();
                map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                map.setZoom(20);
                map.setTilt(45);
                map.panTo(this.getPosition());
                NProgress.done();
            });
        }
    }
}

function addButtons(lat, lng, category) {
    $("table").append("<tr class='store "+category+"'><td><button onclick=\"centerMap(" + lat + "," + lng
        + ");\">Center Here</button></td></tr>");
}

function addFilterCheckBox(type) {
    var id_filter = escapeText(type);
    console.log(id_filter);
    $(".filter_boxes").append("<div class='checkbox'><label><input type='checkbox' id="+id_filter+"_filter onClick='filterOnClick("+id_filter+")' value='option1'>" + id_filter + "<label></div>");
}

function filterOnClick(id_filter) {
    $("#Software").on('click', function() {
        $(".store").css("display", "none");
        $(".Software").css("display", "block");
    })
}

function centerMap(lat, lng) {
    NProgress.start();
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    NProgress.done();
}

function myBadLoadFunction(XMLHttpRequest,errorMessage,errorThrown) {
  alert("Load failed:"+errorMessage+":"+errorThrown);
}
      
function myReadyFunction(){
  $.ajax({
    //url: "/myProxy.php?http://store.usgs.gov/stores/feed/v1.0/summary/all_hour.geojson",
    url: "js/storeData.json",
    dataType: "json",
    success: quakeReader,
    error: myBadLoadFunction
  });
}