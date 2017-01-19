'user strict';
angular.module('carukit.controllers', ['carukit.services', 'ConnectivityMonitor'])

        .controller('MapCtrl', function ($ionicPlatform, $ionicLoading, $scope, $state, $cordovaGeolocation, $ionicPopup, ConnectivityMonitor, RSServices, httpService) {

            $ionicPlatform.ready(function () {

                //initate variable
                $scope.latLng = 0;
                $scope.data = [];
                var polylinePath;
                var directionsService;
                var directionsDisplay;
                var METERS_TO_MILES = 0.000621371192;
                var markers = [];
                $scope.temps = [];
                var options = {timeout: 10000, enableHighAccuracy: true};
                if (!ConnectivityMonitor.isOnline()) {
                    $ionicPopup.alert({title: 'Informasi', template: 'Anda tidak terhubung ke internet'});
                    return null;
                }

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Mencari Lokasi!'
                });
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

                    $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    console.log("Data ke " + position.coords.latitude + ' ' + position.coords.longitude);
                    var mapOptions = {
                        center: $scope.latLng,
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    //calculate latitude and longitude
                    $scope.listRS = RSServices.getAllStatic();
                    var mapKoordinat = [];
                    for (i = 0; i < $scope.listRS.length; i++) {
                        item = $scope.listRS[i];
                        var koordinat = item.koordinat_lbs.split(",");
                        tolatLng = new google.maps.LatLng(koordinat[0], koordinat[1]);
                        dist = google.maps.geometry.spherical.computeDistanceBetween($scope.latLng, tolatLng);
                        km = (dist / 1000).toFixed(1);
                        //console.log(JSON.stringify(koordinat));
                        //console.log("Data ke " + i + ' ' + item.koordinat_lbs);
                        //console.log("Distance :" + km);
                        obj = {"id": item.kode, "km": km, "lat": parseFloat(koordinat[0]), "lng": parseFloat(koordinat[1]), item: item}
                        mapKoordinat.push(obj);
                    }
                    //console.log("mapKoordinat :" + mapKoordinat.length);
                    //console.log("mapKoordinat :" + JSON.stringify(mapKoordinat));
                    mapKoordinat.sort(function (a, b) {
                        return parseFloat(a.km) - parseFloat(b.km);
                    });
                    //ambil 3 terdekat
                    //console.log("mapKoordinat :" + JSON.stringify(mapKoordinat));
                    var mapKoordinatbyRadian = mapKoordinat.slice(0, 3);
                    //console.log("Current Location :" + $scope.latLng);
                    currentPosition();
                    for (i = 0; i < mapKoordinatbyRadian.length; i++) {
                        item = mapKoordinatbyRadian[i];
                        console.log("Koordinat :" + item.lat + ':' + item.lng);
                        var location = new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
                        addMarker(markers, location, $scope.map, item.item.nama);
                    }

                    var mapLines = [];
                    mapLines.push($scope.latLng);
                    directionsService = new google.maps.DirectionsService();
                    // Hitung jarak berdasarkan jalan yang dilalui dengan mobil
                    var mapKoordinatbydriving = [];
                    console.log("Current Locationss :" + JSON.stringify($scope.latLng));
                    destinations = [$scope.latLng];
                    for (i = 0; i < mapKoordinatbyRadian.length; i++) {
                        item = mapKoordinatbyRadian[i];
                        newlatLang = new google.maps.LatLng(parseFloat(mapKoordinatbyRadian[i].lat), parseFloat(mapKoordinatbyRadian[i].lng));
//                        GoogleMapDistance(origin, destination, callbackFunction,$scope.data);

                        mapLines.push(newlatLang);
                        destinations.push(newlatLang);
                        
                    }                    
                    origins = mapKoordinatbyRadian;
                    destinations = destinations.concat(mapKoordinatbyRadian);
                    console.log("length :" + JSON.stringify(origins))
                    console.log("length :" + JSON.stringify(destinations))
                    
                    GoogleMapDistance(origins, destinations, callbackFunction);

                    //console.log("||" + JSON.stringify($scope.data));

                    //console.log("temps::" + JSON.stringify($scope.temps));
                    //console.log("Temps" + JSON.stringify(temps));


                    //add the start lang to drawback line to the start                    
                    mapLines.push($scope.latLng);
                    console.log("length :" + mapLines.length)


                    polylinePath = new google.maps.Polyline({
                        path: mapLines,
                        strokeColor: "#0066ff",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                    });
                    // draw polyline
                    polylinePath.setMap($scope.map);
                    var rendererOptions = {draggable: true};
                    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
                    directionsDisplay.setMap($scope.map);
                    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                    // Add final route to map
                    var request = {
                        origin: $scope.latLng,
                        destination: mapLines[1],
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        travelMode: google.maps.TravelMode['DRIVING'],
                        avoidHighways: false,
                        avoidTolls: false
                    };

                    console.log("||>" + JSON.stringify($scope.data));

                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            //remove marker cause route create new marker
                            for (index in markers) {

                                if ((markers[index].position.lat() == $scope.latLng.lat() &&
                                        markers[index].position.lng() == $scope.latLng.lng()) ||
                                        (markers[index].position.lat() == mapLines[1].lat() &&
                                                markers[index].position.lng() == mapLines[1].lng())) {
                                    //remove marker
                                    markers[index].setMap(null);
                                }

                            }
                            if (polylinePath != undefined) {
                                polylinePath.setMap(null);
                            }

                        } else {
                            console.log('ga dapat response');
                        }
                    });
                    
                }, function (error) {
                    $ionicLoading.hide();
                    console.log("Could not get location");
                    $ionicPopup.alert({title: 'Informasi', template: 'Time Out, Periksa Jaringan Internet anda'});
                });
                function addMarker(markers, location, map, title) {
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map,
                        title: title
                    }, function (err) {
                        console.err(err);
                    });
                    var infoWindow = new google.maps.InfoWindow({
                        content: title
                    });
//                    infoWindow.open($scope.map, marker);
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });
                    markers.push(marker);
                }



                function GoogleMapDistance(origins, destinations, callback)
                {
                    var service = new google.maps.DistanceMatrixService();
                    service.getDistanceMatrix(
                            {
                                origins: origins,
                                destinations: destinations,
                                travelMode: google.maps.TravelMode.DRIVING,
                                unitSystem: google.maps.UnitSystem.METRIC,
                                avoidHighways: false,
                                avoidTolls: false
                            }, callback)
                }

                function callbackFunction(response, status,data) {
                    // you can access the parent scope arguments like item here
                    if (status == google.maps.DistanceMatrixStatus.OK) {
                        var origins = response.originAddresses;
                        var destinations = response.destinationAddresses;
                        for (var i = 0; i < origins.length; i++) {
                            var results = response.rows[i].elements;
                            for (var j = 0; j < results.length; j++) {
                                var element = results[j];
                                var from = origins[i];
                                var to = destinations[j];
                                var distance = element.distance.text;
                                var duration = element.duration.text;
                                obj = {"distance": distance, "duration": duration, "from": from, "to": to};
                                console.log(JSON.stringify(obj));
                                $scope.data.push(obj);
                                //console.log(JSON.stringify(obj));                                
                            }
                        }
                        console.log("}}"+JSON.stringify($scope.data));
                        $ionicLoading.hide();
                    }else{
                        $ionicLoading.hide();
                    }
                }


                function currentPosition() {
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: $scope.latLng
                    });
                    var infoWindow = new google.maps.InfoWindow({
                        content: " Sekarang Anda Disini"
                    });
                    infoWindow.open($scope.map, marker);
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });
                    //hide loading
                    
                    markers.push(marker);
                }

                $scope.goBack = function () {
                    //$window.history.go(-1);
                    $state.go("app.home");
                };
                $scope.goRefresh = function () {
                    $state.go("app.search");
                    console.log('state refresh');
                    $state.reload();
                };
            });
        })

        .controller('backCtrl', function ($scope, $state) {
            $scope.goBack = function () {
                //$window.history.go(-1);
                $state.go("app.home");
            };
        }
        )

        .controller('listCtrl', function ($scope, RSServices, $state, $ionicHistory) {

            //$scope.listRS = RSServices.getAll();
            $scope.listRS = RSServices.getAllStatic();
            //console.log(JSON.stringify(RSServices.getAll(),null,4));
            $scope.goBack = function () {
                //$window.history.go(-1);
                $state.go("app.home");
            }

        })

        .controller('DetailCtrl', function ($scope, $state, $stateParams, $cordovaSQLite, RSServices) {

            $scope.rs = RSServices.get($stateParams.kode);
            //get detail from database
            /*var kode = $stateParams.kode;
             console.log("Kode ::" + kode);
             $scope.rs = {};
             var db = $cordovaSQLite.openDB(({name: "hospital.db.sqlite", location: 'default'}));
             var query = "SELECT kode,nama,jenis,alamat,koordinat_lbs FROM T_RUMAH_SAKIT WHERE kode = ?";
             $cordovaSQLite.execute(db, query, [kode]).then(function (res) {
             if (res.rows.length > 0) {
             console.log("SELECTED -> " + res.rows.item(0).kode + " " + res.rows.item(0).nama);
             console.log(JSON.stringify({kode: res.rows.item(0).kode, nama: res.rows.item(0).nama}));
             $scope.rs = {
             kode: res.rows.item(0).kode,
             nama: res.rows.item(0).nama,
             jenis: res.rows.item(0).jenis,
             alamat: res.rows.item(0).alamat,
             koordinat_lbs: res.rows.item(0).koordinat_lbs
             };
             } else {
             console.log("No Single Results Found");
             }
             }, function (err) {
             console.error(err);
             });
             console.log(JSON.stringify($scope.rs, null, 4));
             //end get from datbase
             */
            $scope.goBack = function () {
                //$window.history.go(-1);
                $state.go("app.list");
            };
            $scope.openUrl = function (url) {
                window.open("http://" + url, "_system");
                return false;
            };
        })

        .controller('RouteCtrl', function ($ionicPlatform, $ionicLoading, $scope, $state, $stateParams, $cordovaSQLite, RSServices, $cordovaGeolocation, $ionicPopup, ConnectivityMonitor) {

            $scope.rs = RSServices.get($stateParams.kode);
            //get detail from database
            /*var kode = $stateParams.kode;
             console.log("Kode ::" + kode);
             $scope.rs = {};
             var db = $cordovaSQLite.openDB(({name: "hospital.db.sqlite", location: 'default'}));
             var query = "SELECT kode,nama,jenis,alamat,koordinat_lbs FROM T_RUMAH_SAKIT WHERE kode = ?";
             $cordovaSQLite.execute(db, query, [kode]).then(function (res) {
             if (res.rows.length > 0) {
             console.log("SELECTED -> " + res.rows.item(0).kode + " " + res.rows.item(0).nama);
             console.log(JSON.stringify({kode: res.rows.item(0).kode, nama: res.rows.item(0).nama}));
             $scope.rs = {
             kode: res.rows.item(0).kode,
             nama: res.rows.item(0).nama,
             jenis: res.rows.item(0).jenis,
             alamat: res.rows.item(0).alamat,
             koordinat_lbs: res.rows.item(0).koordinat_lbs
             };
             } else {
             console.log("No Single Results Found");
             }
             }, function (err) {
             console.error(err);
             });
             console.log(JSON.stringify($scope.rs, null, 4));
             //end get from datbase
             */

            $ionicPlatform.ready(function () {

                //initate variable
                $scope.latLng = 0;
                var polylinePath;
                var directionsService;
                var directionsDisplay;
                var markers = [];
                var options = {timeout: 10000, enableHighAccuracy: true};
                if (!ConnectivityMonitor.isOnline()) {
                    $ionicPopup.alert({title: 'Informasi', template: 'Anda tidak terhubung ke internet'});
                    return null;
                }

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Mencari Lokasi!'
                });
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

                    $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    console.log("Data ke " + position.coords.latitude + ' ' + position.coords.longitude);
                    //$scope.latLng = new google.maps.LatLng("-6.17036419", "106.87034637");

                    var mapOptions = {
                        center: $scope.latLng,
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    $scope.map = new google.maps.Map(document.getElementById("maproute"), mapOptions);
                    //calculate latitude and longitude


                    var mapLines = [];
                    mapLines.push($scope.latLng);
                    koordinat = $scope.rs.koordinat_lbs.split(",");
                    destlatlng = new google.maps.LatLng(koordinat[0], koordinat[1]);
                    mapLines.push(destlatlng);
                    directionsService = new google.maps.DirectionsService();
                    var rendererOptions = {draggable: true};
                    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
                    directionsDisplay.setMap($scope.map);
                    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                    // Add final route to map
                    var request = {
                        origin: $scope.latLng,
                        destination: destlatlng,
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        travelMode: google.maps.TravelMode['DRIVING'],
                        avoidHighways: false,
                        avoidTolls: false
                    };
                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        } else {

                            console.log('ga dapat response');
                        }

//                        for (index in markers) {
//                            markers[index].setMap(null);
//                        }

                        if (polylinePath != undefined) {
                            polylinePath.setMap(null);
                        }

                    });
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.hide();
                    console.log("Could not get location");
                    $ionicPopup.alert({title: 'Informasi', template: 'Time Out, Periksa Jaringan Internet anda'});
                });
                $scope.goBack = function () {
                    //$window.history.go(-1);
                    $state.go("app.home");
                };
                $scope.goRefresh = function () {
                    $state.go("app.route");
                    console.log('state refresh');
                    $state.reload();
                };
            });
            $scope.goBack = function () {
                window.history.back()
            };
        });




