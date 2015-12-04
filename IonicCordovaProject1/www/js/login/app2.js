// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter2', ['ionic', 'starter2.controllers', 'ngCordova',
  'ionic.service.core',
  'ionic.service.push'])

.run(function ($ionicPlatform) {

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        /*Push notifications Debug*/
        
        var push = new Ionic.Push({
            "debug": true
        });
 
        push.register(function(token) {
            console.log("Device token:",token.token);
        });
        

        /*push notifications Native

        var io = Ionic.io();
        var push = new Ionic.Push({
            "onNotification": function (notification) {
                alert('Received push notification!');
            },
            "pluginConfig": {
                "android": {
                    "iconColor": "#0000FF"
                }
            }
        });
        var user = Ionic.User.current();

        if (!user.id) {
            user.id = Ionic.User.anonymousId();
        }

        // Just add some dummy data..
        user.set('name', 'Emiliano');
        user.set('bio', 'This is my little bio');
        user.save();

        var callback = function (data) {
            push.addTokenToUser(user);
            console.log("user: " + user);
            user.save();
        };
        push.register(callback);
        */
    });/*close ionicplatform ready*/

})


.config(function ($ionicAppProvider) {


    /*Registrar App para push notifications*/
    $ionicAppProvider.identify({
        app_id: 'cc6c1ddc',
        api_key: '45556158349ec0523cccf0f766fc10aee728c86d0c4cf69d', //key public
        dev_push: true
    });

})