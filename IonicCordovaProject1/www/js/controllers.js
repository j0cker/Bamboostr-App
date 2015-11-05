angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $ionicTabsDelegate, $http, $rootScope, $ionicLoading, $timeout) {
    $ionicLoading.show({
        template: '<ion-spinner class="dots"></ion-spinner>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    var storage = JSON.parse(localStorage.getItem('bamboostr'));
    $rootScope.id_token = storage[0].id_token;
    $rootScope.user = storage[0].screen_name;
    $rootScope.identify = storage[0].identify;
    $rootScope.red = storage[0].red;
    console.log($rootScope.id_token);
    var url = 'http://bamboostr.com/app/get-cuentas.php';
    $http.get(url, { cache: true, params: { id_token: $rootScope.id_token, user: $rootScope.user, identify: $rootScope.identify } })
         .then(function (response) {
             $rootScope.account = [];
             var c = 0;
             while (response.data[c]) {
                 $rootScope.account[c] = [];
                 $rootScope.account[c] = response.data[c];
                 c++;
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
    

    console.log("Load Mensajes Programados");

    $scope.options = function () {
        console.log("Entro a opciones");
    }

    /*swipe*/
    $scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    }
    /*fin swipe*/
})

.controller('ChatsCtrl', function ($scope, Chats, $ionicTabsDelegate, $rootScope) {

    console.log($rootScope.id_token);

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }

    /*swipe*/
  $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
          $ionicTabsDelegate.select(selected + 1);
      }
  }

  $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
          $ionicTabsDelegate.select(selected - 1);
      }
  }
    /*fin swipe*/
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, $rootScope) {
    $scope.chat = Chats.get($stateParams.chatId);

})

.controller('AccountCtrl', function ($scope, $ionicTabsDelegate, $ionicLoading, $timeout, $cordovaOauth, $http, $rootScope, $ionicPopup, $ionicModal, $ionicActionSheet) {

  console.log($rootScope.id_token);

  $scope.settings = {
    enableFriends: true
  };

  $scope.remove = function (identify, red, type, id) {
      console.log($rootScope.identify + " " + identify + " " + red + " " + type + " " + id);
      $ionicLoading.show({
          template: '<ion-spinner class="dots"></ion-spinner>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });

      if (type == "cuenta") {
          var url = 'http://bamboostr.com/app/eliminarUser.php';
          $http.get(url, { cache: true, params: { identifyEliminar: identify, identify: $rootScope.identify, red: $rootScope.red } })
             .then(function (response) {
                 /*almacenar nuevo usuario*/
                 console.log(response);
                 console.log("cuenta eliminada");
                 var confirmPopup = $ionicPopup.confirm({
                     title: 'Cuenta Eliminada'
                 });
                 confirmPopup.then(function (res) {
                     /*if (res) {
                         console.log('You are sure');
                     } else {
                         console.log('You are not sure');
                     }*/
                     window.location = "in.html";
                 });

                 $timeout(function () {
                     $ionicLoading.hide();
                 }, 2000);
             }, function (response) {
                 /*ERROR*/
                 $timeout(function () {
                     $ionicLoading.hide();
                 }, 2000);
             });
      } else {
          var url = 'http://bamboostr.com/app/delete-fan-pages.php';
          $http.get(url, { cache: true, params: { id: id } })
             .then(function (response) {
                 /*almacenar nuevo usuario*/
                 console.log(response);
                 console.log("cuenta eliminada");
                 var confirmPopup = $ionicPopup.confirm({
                     title: 'Cuenta Eliminada'
                 });
                 confirmPopup.then(function (res) {
                     /*if (res) {
                         console.log('You are sure');
                     } else {
                         console.log('You are not sure');
                     }*/
                     window.location = "in.html";
                 });

                 $timeout(function () {
                     $ionicLoading.hide();
                 }, 2000);
             }, function (response) {
                 /*ERROR*/
                 $timeout(function () {
                     $ionicLoading.hide();
                 }, 2000);
             });
      }
  }

    /*Action Sheet*/
  $scope.sheet = function (identify, red, type, id) {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
          titleText: 'Borrar Cuenta?',
          destructiveText: 'Delete',
          destructiveButtonClicked: function () {
              $scope.remove(identify, red, type, id);
          }
      });
  } /*fin button sheet*/

  $scope.modalOpen = function () {
      $ionicModal.fromTemplateUrl('modal.html',
          {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();

              $scope.hideModal = function () {
                  modal.hide();
              }

              $scope.facebookLogin = function () {
                  $ionicLoading.show({
                      template: '<ion-spinner class="dots"></ion-spinner>',
                      animation: 'fade-in',
                      showBackdrop: true,
                      maxWidth: 200,
                      showDelay: 0
                  });

                  $cordovaOauth.facebook("464694450276578", ["user_about_me", "user_activities", "user_birthday", "user_education_history", "user_events", "user_groups", "user_hometown", "user_interests", "user_likes", "user_location", "user_photos", "user_relationships", "user_relationship_details", "user_religion_politics", "user_status", "user_videos", "user_website", "email", "manage_pages", "read_stream", "read_page_mailboxes", "read_insights", "ads_management", "read_friendlists", "publish_actions", "public_profile", "user_friends", "read_mailbox", "user_posts", "ads_read", "ads_management"]).then(function (result) {
                      //console.log(result);
                      //console.log(result.access_token);
                      //window.location = "in.html";

                      var url = 'http://bamboostr.com/app/login-facebook.php';
                      $http.get(url, { cache: true, params: { access_token: result.access_token, secundaria: "si", id_token: $rootScope.id_token, user: $rootScope.user, identify: $rootScope.identify, red: $rootScope.red } })
                           .then(function (response) {
                               console.log(response.data);
                               /*almacenar nuevo usuario*/
                               if (response.data && response.data.id_token && response.data.user && response.data.identify) {
                                   console.log("cuenta agregada");
                                   var confirmPopup = $ionicPopup.confirm({
                                       title: 'Agrega nueva red social',
                                       template: 'Red social agregada: ' + response.data.user
                                   });
                                   confirmPopup.then(function (res) {
                                       /*if (res) {
                                           console.log('You are sure');
                                       } else {
                                           console.log('You are not sure');
                                       }*/
                                       window.location = "in.html";
                                   });
                               } else {
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

              $scope.twitterLogin = function () {
                  var api_key = "JSkvmSToy2nUwUoaqeDYLmPeG"; //Enter your Consumer Key (API Key)
                  var api_secret = "Eeuv68S2e6NqkxvTUNoIuPKtEnhQm1X5BUOUD5hZ1DfK2EV6FC"; // Enter your Consumer Secret (API Secret)

                  $cordovaOauth.twitter(api_key, api_secret).then(function (result) {
                      //console.log(result);
                      //console.log(result.oauth_token);
                      //console.log(result.oauth_token_secret);
                      //console.log(result.screen_name);
                      //console.log(result.user_id);
                      var url = 'http://bamboostr.com/app/login-twitter.php';
                      $http.get(url, { cache: true, params: { oauth_token: result.oauth_token, oauth_token_secret: result.oauth_token_secret, secundaria: "si", id_token: $rootScope.id_token, user: $rootScope.user, identify: $rootScope.identify, red: $rootScope.red } })
                           .then(function (response) {
                               console.log(response.data);
                               /*almacenar nuevo usuario*/
                               if (response.data && response.data.id_token && response.data.user && response.data.identify) {
                                   console.log("cuenta agregada");
                                   var confirmPopup = $ionicPopup.confirm({
                                       title: 'Agrega nueva red social',
                                       template: 'Red social agregada: ' + response.data.user
                                   });
                                   confirmPopup.then(function (res) {
                                       /*if (res) {
                                           console.log('You are sure');
                                       } else {
                                           console.log('You are not sure');
                                       }*/
                                       window.location = "in.html";
                                   });
                               } else {
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
                  }, function (error) {
                      $timeout(function () {
                          $ionicLoading.hide();
                      }, 2000);
                      // error
                  })
              } /*fin button twitterLogin*/

              $scope.instagramLogin = function () {

                  $cordovaOauth.instagram('1785b2c2431844fca017e967bf72b439', ["basic", "comments", "relationships", "likes"]).then(function (result) {
                      console.log(result);
                      console.log(result.access_token);
                  }, function (error) {
                      console.log("ERROR");
                  })
              } /*fin button twitterLogin*/
          });

  };
    /*Fin Modal*/

  $scope.signOut = function () {
      $ionicLoading.show({
          template: '<ion-spinner class="dots"></ion-spinner>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      console.log("Sign Out");
      window.location = "index.html";
      localStorage.removeItem('bamboostr');
      $timeout(function () {
          $ionicLoading.hide();
      }, 2000);
  };

    /*swipe*/
  $scope.goForward = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
          $ionicTabsDelegate.select(selected + 1);
      }
  }

  $scope.goBack = function () {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
          $ionicTabsDelegate.select(selected - 1);
      }
  }
    /*fin swipe*/
});
