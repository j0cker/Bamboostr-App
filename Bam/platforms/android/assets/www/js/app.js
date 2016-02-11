// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-modal-select', 'ionic.service.core', 'starter.controllers', 'starter.services', 'ngCordova','ionic-timepicker', 'ionic-material', 'ionMdInput', 'base64', 'ngCordova.plugins.instagram'])

.run(function ($ionicPlatform, $ionicSideMenuDelegate ,$rootScope, $http, $cordovaBadge) {
    $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleLightContent();
      StatusBar.styleDefault();
    }

    var storage = JSON.parse(localStorage.getItem('bamboostr'));
    $rootScope.id_token = storage[0].id_token;
    $rootScope.user = storage[0].screen_name;
    $rootScope.identify = storage[0].identify;
    $rootScope.red = storage[0].red;
    $rootScope.image_red = storage[0].image_red;
    var url = "http://bamboostr.com/app/get-nuevoUser.php";
    $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, option:'1'} })
         .then(function (response) {
             console.log("Tutorial");
             console.log(response);
             if (response.data.nuevoUser == 0) {
                 var url = "http://bamboostr.com/app/get-nuevoUser.php";
                 $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, option: '2' } })
                   .then(function (response) {
                   }, function (response) {
                       /*ERROR*/
                   });
                //window.location = "tuto.html";
             }
         }, function (response) {
             /*ERROR*/
         });

    /*push notifications IO*/

    var io = Ionic.io();
    var push = new Ionic.Push({
        "onNotification": function (notification) {

            console.log("notification");
            console.log(notification);
            //e -> title and text
            if (notification.text == "Instagram a atender") {
                var url = "http://bamboostr.com/scripts/get-notificaciones.php";
                $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, option: '2' } })
                     .then(function (response) {
                         console.log("Notificaciones");
                         console.log(response.data);
                         if (response.data.

                             error) {
                             $rootScope.not = "";
                             document.getElementById("mensaje23not").style.display = "block";
                             $rootScope.contNot = "0";
                         } else {
                             document.getElementById("mensaje23not").style.display = "none";
                             $rootScope.not = response.data.data;
                             $rootScope.contNot = response.data.cont;
                         }

                     }, function (response) {
                         /*ERROR*/
                     });
                alert('Mensaje Programado de Instagram. Ve a tus notificaciones para publicar el mensaje');
            } else {
                alert('Mensaje Programado: Enviado Correctamente. Te invitamos a programar tu siguiente mensaje.');
            }
            var url = "http://bamboostr.com/scripts/get-program-message.php";
            $http.get(url, { cache: false, params: { id_token: $rootScope.id_token } })
                 .then(function (response) {
                     if (response.data.data)
                         document.getElementById("msgPro123F").style.background = "";
                     $rootScope.msgPro = response.data.data;

                 }, function (response) {
                     /*ERROR*/
                 });
        },
        "style":"inbox",
        "pluginConfig": {
            "android": {
                "iconColor": "#0000FF",
                "sound": true,
                "vibration": true,
                "badge": true,
                "clearBadge": true,
                "style":"inbox"
            },
            "ios": {
                "iconColor": "#0000FF",
                "sound": true,
                "vibration": true,
                "badge": true,
                "clearBadge": true,
                "style": "inbox"
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
        console.log("TOKEN AND USER: " + data.token + " " + $rootScope.id_token);
        var url = "http://bamboostr.com/app/dev-token.php";
        $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, token: data.token } })
             .then(function (response) {
                 console.log(response);
             }, function (response) {
                 /*ERROR*/
             });
        push.addTokenToUser(user);
        user.save();
    };
    push.register(callback);

      
  });/*fiin $ionicPlatform.ready*/


  $rootScope.$on('$ionicView.enter', function () {
      /*parametros: $rootScope.$on '$includeContentLoaded', '$viewContentLoaded', '$stateChangeSuccess', '$ionicView.enter'*/
      /*quita el slide o swipe en el menu y solo se activara con click*/
      $ionicSideMenuDelegate.canDragContent(false);
  });
})


.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    //$ionicConfigProvider.views.maxCache(0);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      },
      'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
      },
      'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
      },
      'fabContent': {
          template: '<button ng-click="escribir();" class="button button-fab button-fab-bottom-right button-positive"><i style="font-size: 20px;" class="ion-edit"></i></button>'
      },
        
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

.directive('standardTimeMeridian', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            etime: '=etime'
        },
        template: "<strong>{{stime}}</strong>",
        link: function (scope, elem, attrs) {

            scope.stime = epochParser(scope.etime, 'time');

            function prependZero(param) {
                if (String(param).length < 2) {
                    return "0" + String(param);
                }
                return param;
            }

            function epochParser(val, opType) {
                if (val === null) {
                    return "00:00";
                } else {
                    var meridian = ['AM', 'PM'];

                    if (opType === 'time') {
                        var hours = parseInt(val / 3600);
                        var minutes = (val / 60) % 60;
                        var hoursRes = hours > 24 ? (hours - 24) : hours;

                        var currentMeridian = meridian[parseInt(hours / 24)];

                        return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                    }
                }
            }

            scope.$watch('etime', function (newValue, oldValue) {
                scope.stime = epochParser(scope.etime, 'time');
            });

        }
    };
})

.directive('standardTimeNoMeridian', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            etime: '=etime'
        },
        template: "<strong>{{stime}}</strong>",
        link: function (scope, elem, attrs) {

            scope.stime = epochParser(scope.etime, 'time');

            function prependZero(param) {
                if (String(param).length < 2) {
                    return "0" + String(param);
                }
                return param;
            }

            function epochParser(val, opType) {
                if (val === null) {
                    return "00:00";
                } else {
                    if (opType === 'time') {
                        var hours = parseInt(val / 3600);
                        var minutes = (val / 60) % 60;

                        return (prependZero(hours) + ":" + prependZero(minutes));
                    }
                }
            }

            scope.$watch('etime', function (newValue, oldValue) {
                scope.stime = epochParser(scope.etime, 'time');
            });

        }
    };
});