﻿angular.module('starter2.controllers', ['ionic'])


.controller('login', function ($scope, $cordovaOauth, $ionicLoading, $timeout, $http, $ionicSlideBoxDelegate) {

    $scope.savedLocalStorage = localStorage.getItem('bamboostr');
    if ($scope.savedLocalStorage !== null) {
        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        window.location = "in.html";
        console.log("Tiene Algo");
        $timeout(function () {
            $ionicLoading.hide();
        }, 2000);
    } else {
        console.log("No Tiene Algo");
    }


    $scope.twitterLogin = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var api_key = "JSkvmSToy2nUwUoaqeDYLmPeG"; //Enter your Consumer Key (API Key)
        var api_secret = "Eeuv68S2e6NqkxvTUNoIuPKtEnhQm1X5BUOUD5hZ1DfK2EV6FC"; // Enter your Consumer Secret (API Secret)

        $cordovaOauth.twitter(api_key, api_secret).then(function (result) {

            console.log(result);
            console.log(result.oauth_token);
            console.log(result.oauth_token_secret);
            console.log(result.screen_name);
            console.log(result.user_id);
            localStorage.setItem('bamboostr', JSON.stringify([{ screen_name: result.screen_name, identify: result.user_id }]));
            var url = 'http://betatest.bamboostr.com/app/login-twitter.php';
            $http.get(url, { cache: true, params: { oauth_token: result.oauth_token, oauth_token_secret: result.oauth_token_secret, secundaria: "no" } })
                 .then(function (response) {
                     console.log(response);
                     if (response.data.id_token && response.data.user && response.data.identify) {
                         localStorage.setItem('bamboostr', JSON.stringify([{ id_token: response.data.id_token, identify: response.data.identify, screen_name: response.data.user, image_red: response.data.image_red, red: 'twitter' }]));

                         var storage = JSON.parse(localStorage.getItem('bamboostr'));
                         //console.log(storage[0].id_token);
                         //$scope.id_token = storage[0].id_token;
                         window.location = "in.html";
                     }
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 }, function (response) {
                     /*ERROR*/
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 });


            // results
        }, function (error) {
            console.log(error);
            $timeout(function () {
                $ionicLoading.hide();
            }, 2000);
            // error
        });
    }/*fin twitter login*/

    $scope.facebookLogin = function () {
        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $cordovaOauth.facebook("464694450276578", ["user_about_me", "user_activities", "user_birthday", "user_education_history", "user_events", "user_groups", "user_hometown", "user_interests", "user_likes", "user_location", "user_photos", "user_relationships", "user_relationship_details", "user_religion_politics", "user_status", "user_videos", "user_website", "email", "manage_pages", "read_stream", "read_page_mailboxes", "read_insights", "ads_management", "read_friendlists", "publish_actions", "public_profile", "user_friends", "read_mailbox", "user_posts", "ads_read", "ads_management"]).then(function (result) {

            var url = 'http://betatest.bamboostr.com/app/login-facebook.php';
            $http.get(url, { cache: true, params: { access_token: result.access_token, secundaria: "no" } })
                 .then(function (response) {
                     if (response.data.id_token && response.data.identify && response.data.user) {
                         localStorage.setItem('bamboostr', JSON.stringify([{ id_token: response.data.id_token, identify: response.data.identify, screen_name: response.data.user, image_red: response.data.image_red, red: 'facebook' }]));

                         var storage = JSON.parse(localStorage.getItem('bamboostr'));
                         //console.log(storage[0].id_token);
                         //$scope.id_token = storage[0].id_token;
                         window.location = "in.html";
                     }
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 }, function (response) {
                     /*ERROR*/
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 });

           
            // results
        }, function (error) {
            $timeout(function () {
                $ionicLoading.hide();
            }, 2000);
            // error
        });
    }/*fin facebook login*/

    $scope.mailLogin = function () {

        if(document.getElementById('loginsDiv').style.display=="none"){
          document.getElementById('loginsDiv').style.display = "block";
          document.getElementById('loginsDiv2').style.display = "none";
        } else {
          document.getElementById('loginsDiv').style.display = "none";
          document.getElementById('loginsDiv2').style.display = "block";
        }
    };/*fin mail login*/

    $scope.ingresarLogin = function () {

        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        console.log("Ingresar Por mail");
        console.log(document.getElementById('nameISForm').value + " " + document.getElementById('passwordISForm').value);

        if (!document.getElementById('nameISForm').value) {
            alert("Escribe tu usuario");
        } else if (!document.getElementById('passwordISForm').value) {
            alert("Escribe tu contraseña correctamente");
        } else {

            var url = 'http://betatest.bamboostr.com/login.php';
            $http.get(url, { cache: true, params: { nombre: document.getElementById('nameISForm').value, password: document.getElementById('passwordISForm').value } })
                 .then(function (response) {
                   obj = response.data;
                   if (obj.success == "true") {
                       if (response.data.id_token && response.data.identify && response.data.user) {
                           localStorage.setItem('bamboostr', JSON.stringify([{ id_token: response.data.id_token, identify: response.data.identify, screen_name: response.data.user, image_red: response.data.image_red, red: 'no' }]));

                           var storage = JSON.parse(localStorage.getItem('bamboostr'));
                           //console.log(storage[0].id_token);
                           //$scope.id_token = storage[0].id_token;
                           window.location = "in.html";
                       }
                    } else {
                        alert(obj.text);
                    }
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 }, function (response) {
                     /*ERROR*/
                     alert("ERROR");
                     $timeout(function () {
                         $ionicLoading.hide();
                     }, 2000);
                 });
        }
    }

    /*slider*/

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
      console.log(index);
    $scope.slideIndex = index;
  };

  $scope.slideChanged2 = function (index) {
      console.log("entro");
      $ionicSlideBoxDelegate.slide(index);
  };

});
