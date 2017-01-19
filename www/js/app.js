// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
'user strict';

var store = window.localStorage;
angular.module('appCarukit', ['ionic', 'ngCordova', 'carukit.controllers'])

        .run(function ($ionicPlatform, $cordovaSQLite) {

            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
//                var db = null;
//                window.plugins.sqlDB.copy("hospital.db.sqlite", function () {
//                    db = $cordovaSQLite.openDB(({name:"hospital.db.sqlite", location:'default'}));
//                    console.error("Databse hospital success copied and Open");
//                }, function (error) {
//                    console.error("There was an error copying the database: " + error);
//                    db = $cordovaSQLite.openDB(({name:"hospital.db.sqlite", location:'default'}));
//                });
            });
        })


        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        cache: false,
                        templateUrl: 'pages/template.html'

                    })

                    .state('app.home', {
                        url: '/home',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/home.html'
                            }
                        }
                    })

                    .state('app.list', {
                        url: '/list',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/list.html',
                                controller: 'listCtrl'
                            }
                        }
                    })
                    

                    .state('app.rs', {
                        url: '/rs/:kode',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/detail.html',
                                controller: 'DetailCtrl'
                            }
                        }
                    })
                    
                    .state('app.route', {
                        url: '/route/:kode',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/route.html',
                                controller: 'RouteCtrl'
                            }
                        }
                    })
                    
                    .state('app.search', {
                        url: '/search',
                        cache: true,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/search.html',
                                controller: 'MapCtrl'
                            }
                        }
                    })

                    .state('app.about', {
                        url: '/about',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'pages/about.html',
                                controller: 'backCtrl'
                            }
                        }
                    })



            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        })

        