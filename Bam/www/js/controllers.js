/* global angular, document, window */


var imagenes = "";
var redesAdd = [];

angular.module('starter.controllers', ['ionic-timepicker', 'ngCordova', 'base64', 'ngCordova.plugins.instagram'])

.controller('AppCtrl', function ($cordovaCamera, $cordovaToast, $cordovaClipboard, $ionicPopup, $ionicLoading, $ionicActionSheet, $ionicPlatform, $http, $ionicSideMenuDelegate, $cordovaDatePicker, $cordovaImagePicker, $scope, $rootScope, $ionicModal, $ionicPopover, $timeout, $cordovaNativeAudio, $cordovaInstagram, $base64) {
    
    $ionicPlatform.ready(function() {
        iniSounds($cordovaNativeAudio);

    });

    /*opcion para enviar normal o programado*/
    $rootScope.opcion = 0;

    escribir($rootScope, $ionicActionSheet, $cordovaNativeAudio, $ionicModal, $cordovaImagePicker, $cordovaDatePicker, $http, $ionicLoading, $cordovaInstagram, $base64);

    agregarRed($rootScope, $cordovaNativeAudio);


    /****TimePicker****/

    var optionsDate = {
        date: new Date(),
        mode: 'date', // or 'time'
        minDate: new Date() - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
    };

    $rootScope.date = function () {
        $rootScope.opcion = 1;
        $cordovaNativeAudio.play('click');

        $cordovaDatePicker.show(optionsDate).then(function (date) {
            $rootScope.timePicker(date);
        });
    };

    $rootScope.timePicker = function (date) {
        document.getElementById('time').style.display = "block";
        document.getElementById('dateShow').style.display = "block";
        document.getElementById('dateShow').innerHTML = "<strong>" + convertDate(date) + "</strong>";

    };

    /****TimePicker****/

    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function (bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function () {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function () {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function () {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $rootScope.browser = function (url) {
        console.log("browser");
        window.open(url, '_blank', 'location=yes');
    }

    $rootScope.copy = function (text,opcion) {
        console.log(text);
        if(opcion==1){
            var texto = text.title;
        } else {
            var texto = text.description;
        }
        $cordovaClipboard.copy(texto).then(function () {
            // success
            console.log("texto copiado");
            $cordovaToast.show('Texto Copiado', 'long', 'center')
            .then(function (success) {
                // success
            }, function (error) {
                // error
            });
        }, function () {
            // error
        });

    }

    var optionsImage = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
    };

    $rootScope.image = function () {

        $cordovaNativeAudio.play('click');
        imagenes = "";
        console.log("Imagen");
        $cordovaImagePicker.getPictures(optionsImage)
            .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    imagenes = "";
                    console.log('Image URI: ' + results[i]);
                    imagenes += "" + imagenes + "" + results[i] + ",";
                }
                if (imagenes != "") {
                    document.getElementById('imagenItem').style.display = "block";
                    document.getElementById('imagenPre').src = results[0];
                }
            }, function (error) {
                // error getting photos
            });
    };

    /*Action Sheet*/
    $rootScope.sheetImagen = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: 'Que deseas hacer?',
            buttons: [
                { text: "<i class='icon ion-camera'></i>Cámara" },
                { text: "<i class='icon ion-briefcase'></i>Galería" },
            ],
            buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                    var options = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                    };

                    $cordovaCamera.getPicture(options).then(function (imageURI) {
                        console.log(imageURI);
                        var image = document.getElementById('imagenPre');
                        image.src = imageURI;
                        document.getElementById('imagenItem').style.display = "block";
                    }, function (err) {
                        // error
                    });
                } else if (index == 1) {
                    $rootScope.image();
                }
                return true;
            },
            destructiveText: '<button class="button button-assertive">Cancelar</button>',
            destructiveButtonClicked: function () {
                hideSheet();
            }
        });
    } /*fin button sheet*/

    /*Action Sheet*/
    $rootScope.sheetContenido = function (json) {
        console.log(json);

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: 'Que deseas hacer?',
            buttons: [
                { text: "<i class='icon ion-link'></i>Ir a la página" },
                { text: "<i class='icon ion-ios-copy-outline'></i>Copiar Título" },
                { text: "<i class='icon ion-ios-copy-outline'></i>Copiar Descripción" },
            ],
            buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                    $rootScope.browser(json.link);
                } else if (index == 1) {
                    $rootScope.copy(json, '1');
                } else if (index == 2) {
                    $rootScope.copy(json, '2');
                }
                return true;
            },
            destructiveText: '<button class="button button-assertive">Cancelar</button>',
            destructiveButtonClicked: function () {
                hideSheet();
            }
        });
    } /*fin button sheet*/

    $rootScope.sound = function () {
        $cordovaNativeAudio.play('click');
    }

    $rootScope.removeNot = function (id) {

        $cordovaNativeAudio.play('click');

        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        console.log("Id Remove notificacion");
        console.log(id);
        var url = 'http://bamboostr.com/scripts/eliminarNotificacion.php';
        $http.get(url, { cache: false, params: { id: id } })
           .then(function (response) {
               /*almacenar nuevo usuario*/
               console.log(response);
               console.log("Mensaje eliminado");
               var confirmPopup = $ionicPopup.confirm({
                   title: 'Mensaje eliminado'
               });
               confirmPopup.then(function (res) {
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

    /*Action Sheet*/
    $rootScope.sheetNot = function (id, imagen, mensaje) {
        console.log("id: " + id + " imagen: " + imagen + " mensaje: " + mensaje);
        $cordovaNativeAudio.play('click');

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: 'Que deseas hacer?',
            buttons: [
                { text: "<a>Enviar Mensaje</a>" },
            ],
            buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                    console.log("Enviar Mensaje");
                    $ionicLoading.show({
                        template: '<ion-spinner class="dots"></ion-spinner>',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    function getBase64Image(img) {
                        var canvas = document.createElement("canvas");
                        console.log(img.src);
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        var dataURL = canvas.toDataURL("image/png");
                        return dataURL;
                    }
                    document.getElementById('imagenPre2').src = imagen;
                    var data = getBase64Image(document.getElementById('imagenPre2'));
                    console.log(data);
                    //data:image/jpeg;base64,/
                    Instagram.share(data, mensaje, function (err) {
                        if (err) {
                            // Didn't work
                            console.log(err);
                            //alert("ERROR Instagram" + err);
                            $ionicLoading.hide();
                        } else {
                            //work
                            finishSend++;
                            if (finishSend == redesAdd.length) {
                                alert("Se ha enviado el Mensaje a todos Los destinatarios");
                                //document.getElementById("countES").value = "";
                                $rootScope.modal.remove();
                                imagenes = '';
                                $ionicLoading.hide();
                                redesAdd = [];
                                $rootScope.removeNot(id);
                            }
                        }
                    });
                }
                return true;
            },
            destructiveText: '<button class="button button-assertive">Delete</button>',
            destructiveButtonClicked: function () {
                $rootScope.removeNot(id);
            }
        });
    } /*fin button sheet*/
})

.controller('DashCtrl', function ($cordovaNativeAudio, $ionicSideMenuDelegate, $scope, $cordovaDatePicker, $cordovaImagePicker, $ionicTabsDelegate, $ionicModal, $http, $rootScope, $ionicLoading, $timeout, $ionicUser, $ionicActionSheet, $ionicPopup, ionicMaterialInk, ionicMaterialMotion) {
    
    /*material Design*/
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Ink
    ionicMaterialInk.displayEffect();
    /*fin material design*/

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
    $rootScope.image_red = storage[0].image_red;
    console.log($rootScope.id_token);

    var url = "http://bamboostr.com/scripts/get-notificaciones.php";
    $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, option: '2' } })
         .then(function (response) {
             console.log("Notificaciones");
             console.log(response.data);
             console.log(response.data.cont);
             if (response.data.error) {
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

    var url = "http://bamboostr.com/scripts/get-program-message.php";
    $http.get(url, { cache: false, params: { id_token: $rootScope.id_token } })
         .then(function (response) {
             if(response.data.data)
               document.getElementById("msgPro123F").style.background = "";
             $rootScope.msgPro = response.data.data;

         }, function (response) {
             /*ERROR*/
         });

    var url = "http://bamboostr.com/scripts/get-rssFeed.php";
    $http.get(url, {
        cache: false, params: { categoria: '9', lengua: 'es' },
            headers: {
                "Accept": "application/json;charset=utf-8",
                "Accept-Charset": "charset=utf-8"
            },
        })
         .then(function (response) {
             console.log("Categorias");
             console.log(response);
             if (response.data)
               $rootScope.categorias = response.data;
         }, function (response) {
             /*ERROR*/
         });
    $rootScope.selectableNames = [
    { name: "Noticias, Política y Actualidad", role: "1" },
    { name: "Artes y Humanidades", role: "2" },
    { name: "Negocios y Finanzas", role: "3" },
    { name: "Autos", role: "4" },
    { name: "Educación", role: "5" },
    { name: "Entretenimiento", role: "6" },
    { name: "Belleza y Moda", role: "7" },
    { name: "Ejecicio", role: "8" },
    { name: "Comida y Bebida", role: "9" },
    { name: "Salud", role: "10" },
    { name: "Música", role: "11" },
    { name: "Hogar y Estilo de vida", role: "12" },
    { name: "Crianza y Familia", role: "13" },
    { name: "Religión y Espiritualidad", role: "14" },
    { name: "Ciencia", role: "15" },
    { name: "Mercadotecnia", role: "16" },
    { name: "Deportes", role: "17" },
    { name: "Tecnología", role: "18" },
    { name: "Medio Ambiente", role: "19" },
    { name: "Viajes", role: "20" },
    ];

    $rootScope.getOpt = function (newValue, oldValue) {
        console.log("Cambió" + newValue.role);
        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var url = "http://bamboostr.com/scripts/get-rssFeed.php";
        $http.get(url, {
            cache: false, params: { categoria: '' + newValue.role + '', lengua: 'es' },
            headers: {
                "Accept": "application/json;charset=utf-8",
                "Accept-Charset": "charset=utf-8"
            },
        })
             .then(function (response) {
                 console.log("Categorias");
                 console.log(response);
                 if (response.data)
                     $rootScope.categorias = response.data;
                 $ionicLoading.hide();

             }, function (response) {
                 /*ERROR*/
                 $ionicLoading.hide();
             });
    };

    var url = 'http://betatest.bamboostr.com/scripts/get-cuentas.php';
    $http.get(url, { cache: false, params: { id_token: $rootScope.id_token, user: $rootScope.user, identify: $rootScope.identify } })
         .then(function (response) {
             $rootScope.account = [];
             var c = 0;
             while (response.data[c]) {
                 $rootScope.account[c] = [];
                 $rootScope.account[c] = response.data[c];
                 c++;
             }
             
             $ionicLoading.hide();
         }, function (response) {
             /*ERROR*/
             $ionicLoading.hide();
         });
    

    console.log("Load Mensajes Programados");

    $scope.options = function () {
        console.log("Entro a opciones");
    }

    $scope.remove = function (id) {

        $cordovaNativeAudio.play('click');

        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        console.log(id);
        var url = 'http://bamboostr.com/app/delete-program-message.php';
        $http.get(url, { cache: false, params: { id:id } })
           .then(function (response) {
               /*almacenar nuevo usuario*/
               console.log(response);
               console.log("Mensaje eliminado");
               var confirmPopup = $ionicPopup.confirm({
                   title: 'Mensaje eliminado'
               });
               confirmPopup.then(function (res) {
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

    /*Action Sheet*/
    $scope.sheet = function (id) {

        $cordovaNativeAudio.play('click');

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: 'Borrar Mensaje?',
            destructiveText: '<button class="button button-assertive">Delete</button>',
            destructiveButtonClicked: function () {
                $scope.remove(id);
            }
        });
    } /*fin button sheet*/

    /*swipe tabs*/
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

    $ionicSideMenuDelegate.canDragContent(false);
})

.controller('ChatsCtrl', function ($scope, Chats, $ionicTabsDelegate, $rootScope, $timeout, ionicMaterialInk, ionicMaterialMotion) {

    /*material Design*/
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Ink
    ionicMaterialInk.displayEffect();
    /*fin material design*/

  console.log($rootScope.id_token);

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }

    /*swipe Tabs*/
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

.controller('AccountCtrl', function ($scope, $ionicTabsDelegate, $cordovaNativeAudio, $ionicLoading, $timeout, $cordovaOauth, $http, $rootScope, $ionicPopup, $ionicModal, $ionicActionSheet, ionicMaterialInk, ionicMaterialMotion) {

    /*material Design*/
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Ink
    ionicMaterialInk.displayEffect();
    /*fin material design*/

  console.log($rootScope.id_token);

  $scope.settings = {
    enableFriends: true
  };

  $scope.remove = function (identify, red, type, id) {

      //$cordovaNativeAudio.play('click');

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

      //$cordovaNativeAudio.play('click');

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

      $cordovaNativeAudio.play('click');

      $ionicModal.fromTemplateUrl('modal.html',
          {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();

              $scope.hideModal = function () {
                  modal.hide();
                  modal.remove();
                  $cordovaNativeAudio.play('click');
              }

              //Cleanup the modal when we're done with it!
              $scope.$on('$destroy', function () {
                  $scope.modal.remove();
              });
              // Execute action on hide modal
              $scope.$on('modal.hidden', function () {
                  // Execute action
              });
              // Execute action on remove modal
              $scope.$on('modal.removed', function () {
                  // Execute action
              });

              $scope.facebookLogin = function () {

                  $cordovaNativeAudio.play('click');

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
                                       //window.location = "in.html";
                                   });
                               } else {
                                 //window.location = "in.html";
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

                  $cordovaNativeAudio.play('click');

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
                  $cordovaNativeAudio.play('click');
                  $cordovaOauth.instagram('1785b2c2431844fca017e967bf72b439', ["basic", "comments", "relationships", "likes"]).then(function (result) {
                      //console.log(result);
                      //console.log(result.access_token);
                      
                      var url = 'http://bamboostr.com/app/login-instagram.php';
                      $http.get(url, { cache: false, params: { access_token: result.access_token, secundaria: "si", id_token: $rootScope.id_token, user: $rootScope.user, identify: $rootScope.identify, red: $rootScope.red } })
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
                      console.log("ERROR");
                  })
              } /*fin button twitterLogin*/
          });

  };
    /*Fin Modal*/

  $scope.signOut = function () {
      $cordovaNativeAudio.play('click');
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

    /*swipe Tabs*/
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

/********Functions****************/
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
};

function iniSounds($cordovaNativeAudio) {
    $cordovaNativeAudio.preloadSimple('click', 'audio/tap2.mp3').then(function (msg) {
        console.log(msg);
    }, function (error) {
        console.log(error);
    });
};

function escribir($rootScope, $ionicActionSheet, $cordovaNativeAudio, $ionicModal, $cordovaImagePicker, $cordovaDatePicker, $http, $ionicLoading, $cordovaInstagram, $base64) {

    $rootScope.countLe = 0;

    $rootScope.count = function () {
        $rootScope.countLe = document.getElementById("countEs").value.length;
    };

    /*Action Sheet*/
    $rootScope.imageSheet = function () {

        $cordovaNativeAudio.play('click');
        /* Editor Creative Adobe
        var featherEditor = new Aviary.Feather({
            apiKey: 'f64c8f2d43bb40e5ae583f3665be32f9',
            theme: 'light', // Check out our new 'light' and 'dark' themes!
            tools: ['draw', 'stickers'],
            onSave: function (imageID, newURL) {
                var img = document.getElementById(imageID);
                img.src = newURL;
            }
        });
        */


        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            titleText: 'Borrar o Editar Imagen?',
            
            /*buttons: [
                { text: "<a>Editar imagen</a>" },
            ],
            buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                    console.log("editor");*/

                    /* Editor Creative Adobe
                    
                    featherEditor.launch({
                        image: 'imagenPre',
                        //url: document.getElementById("imagenPre").getAttribute("src")
                        url: 'http://bamboostr.com/images/fan-page.png'
                    });
                    return false;
                    */

                    /* 
                    var image45, container, kit;

                    image45 = new Image();
                    image45.src = "http://bamboostr.com/images/fan-page.png";

                    image45.onload = function () {
                        container = document.querySelector("div#editor");
                        kit = new ImglyKit({
                            image: image45,
                            container: container,
                            assetsUrl: "lib/photoeditorsdk/assets", // Change this to where your assets are
                            ui: {
                                enabled: true // UI is disabled per default
                            }
                        });
                        kit.run();
                    };
                    *//*
                }
                return true;
            },*/

            destructiveText: '<button class="button button-assertive">Delete</button>',
            destructiveButtonClicked: function () {
                $cordovaNativeAudio.play('click');
                imagenes = "";
                document.getElementById("imagenPre").src = "";
                document.getElementById("imagenItem").style.display = "none";
                hideSheet();
            }

        });
    } /*fin button sheet*/
    
    $rootScope.timePickerObject = {

        inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 15,  //Optional
        format: 24,  //Optional
        titleLabel: '24-hour Format',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                $rootScope.timePickerObject.inputEpochTime = val;
                var selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            }
        }
    };

    imagenes = '';
    $rootScope.enviar = function () {

        $cordovaNativeAudio.play('click');

        $ionicLoading.show({
            template: '<ion-spinner class="dots"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var horario = Date().split(" ");
        var husoHorario = horario[5];
        console.log("Huso Horario " + husoHorario);
        if (document.getElementById('imagenPre').src != "file:///android_asset/www/in.html") {
            var img = document.getElementById('imagenPre');
            var imageURI = img.src;
            var options = new FileUploadOptions();
            options.fileKey = "fileImage";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.headers = {
                Connection: "close"
            };

            var params = new Object();
            params.fullpath = imageURI;
            params.name = options.fileName;
            options.params = params;


            var ft = new FileTransfer();
            ft.upload(imageURI, "http://bamboostr.com/subirImagenes.php", win, fail, options);

            function win(r) {
                console.log("Response = " + r.response + " Code = " + r.responseCode + " Sent = " + r.bytesSent);
                imagenes = '' + r.response + ',';
                condicionesEnviar(imagenes, $rootScope.countLe, $http, $rootScope, $ionicLoading, $cordovaInstagram, $base64);
            }

            

            function fail(error) {
                imagenes = '';
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source + "upload error target " + error.target);
                $ionicLoading.hide();
            }
        } else {
            condicionesEnviar('', $rootScope.countLe, $http, $rootScope, $ionicLoading, $cordovaInstagram, $base64);
        }
    };

    $rootScope.escribir = function () {

        $rootScope.countLe = 0;
        $cordovaNativeAudio.play('click');

        $ionicModal.fromTemplateUrl('escribir.html',
            {
                scope: $rootScope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $rootScope.modal = modal;
                $rootScope.modal.show();
                $rootScope.opcion = 0;

                $rootScope.hideModal = function () {
                    modal.hide();
                    $rootScope.modal.remove();
                    $cordovaNativeAudio.play('click');
                    imagenes = '';
                    redesAdd = [];
                    $rootScope.opcion = 0;
                }

                //Cleanup the modal when we're done with it!
                $rootScope.$on('$destroy', function () {
                    $rootScope.modal.remove();
                });
                // Execute action on hide modal
                $rootScope.$on('modal.hidden', function () {
                    // Execute action
                });
                // Execute action on remove modal
                $rootScope.$on('modal.removed', function () {
                    // Execute action
                });

            }

    )
    };
    /*Fin Modal*/
};

function agregarRed($rootScope, $cordovaNativeAudio) {
    $rootScope.agregarRed = function (red, screen_name, identify, identify_account, image) {

        $cordovaNativeAudio.play('click');
        var i = 0, a = 0;
        while (a < redesAdd.length) {
            if (redesAdd[a]['id'] == identify && redesAdd[a]['idAccount'] == identify_account) {
                i++;
            }
            a++;
        }
        if (i == 0) {
            //no hay nada agregemos
            console.log("agregar " + identify);
            redesAdd[redesAdd.length] = new Array();
            if (red == "twitter")
                identify = "" + identify + "tw";
            if (red == "facebook")
                identify = "" + identify + "fa";
            if (red == "instagram")
                identify = "" + identify + "in";
            redesAdd[redesAdd.length - 1]['id'] = identify;
            redesAdd[redesAdd.length - 1]['idAccount'] = identify_account;
            redesAdd[redesAdd.length - 1]['name'] = screen_name;
            redesAdd[redesAdd.length - 1]['image'] = image;
        } else {
            //hay uno quitemos
            console.log("quitar");
            var i = 0;
            while (i < redesAdd.length) {
                if (redesAdd[i]['id'] == identify && redesAdd[i]['idAccount'] == identify_account) {
                    redesAdd.splice(i, 1);
                    i = redesAdd.length;
                }
                i++;
            }
        }
        //document.getElementById("list" + identify + "" + identify_account).setAttribute("ng-click", "quitarRed('" + red + "','" + screen_name + "','" + identify + "','" + identify_account + "');");
        //document.getElementById("list" + identify + "" + identify_account).style.display = "none";
        contadorTeclasCalc();
        console.log(redesAdd);
    };
};

function contadorTeclasCalc() {
    var faDisplay = 0;
    var twDisplay = 0;
    var inDisplay = 0;
    for (var i = 0; i < redesAdd.length; i++) {
        if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "fa")
            faDisplay = 1;
        if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "tw")
            twDisplay = 1;
        if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "in")
            inDisplay = 1;

    }
    if (faDisplay == 1) {
        document.getElementById("contadorFa").style.display = "inline-block";
        //teclas();
    } else {
        document.getElementById("contadorFa").style.display = "none";
    }
    if (twDisplay == 1) {
        document.getElementById("contadorTw").style.display = "inline-block";
        //teclas();
    } else {
        document.getElementById("contadorTw").style.display = "none";
    }
    if (inDisplay == 1) {
        document.getElementById("contadorIn").style.display = "inline-block";
        //teclas();
    } else {
        document.getElementById("contadorIn").style.display = "none";
    }
    if (typeof redesAdd[0] == "undefined") {
        document.getElementById("contadorFa").style.display = "none";
        document.getElementById("contadorTw").style.display = "none";
        document.getElementById("contadorIn").style.display = "none";
    }
};

function condicionesEnviar(image, caracteres, $http, $rootScope, $ionicLoading, $cordovaInstagram, $base64) {

    console.log("|" + document.getElementById("time2").textContent + "|dates|" + document.getElementById("dateShow").textContent + "|" + $rootScope.opcion);


    var finishSend = 0;
  
    var contador = caracteres;
    var texto = document.getElementById("countEs").value;
    console.log(contador + " " + texto + " " + document.getElementById('imagenPre').src + " " + image);
    var imagenesAgregadasArray = [];
  imagenesAgregadasArray = image.split(",");
  if (typeof redesAdd[0] == "undefined") {
      $ionicLoading.hide();
      alert("No has agregado ninguna cuenta");

  } else if((contador==0 || texto=="") && image==""){
      $ionicLoading.hide();
	alert("No has escrito nada");
  }
  else if ( ((contador.length>=141 || contador.length<0) && document.getElementById("contadorTw").style.display=="inline-block") || ((imagenes!="" && contador.length+24>=141) && document.getElementById("contadorTw").style.display=="inline-block")){
      $ionicLoading.hide();
      alert("Muchos caracteres");
  } 
  else if( ((contador.length>=2001 || contador.length<0) && document.getElementById("contadorFa").style.display=="inline-block") ){
      $ionicLoading.hide();
      alert("Muchos caracteres");
  } else if (((contador.length >= 2001 || contador.length < 0) && document.getElementById("contadorIn").style.display == "inline-block")) {
      $ionicLoading.hide();
      alert("Muchos caracteres");
  } else if (((!document.getElementById("dateShow").textContent && document.getElementById("time2").textContent && $rootScope.opcion == 1) ||
            (document.getElementById("dateShow").textContent && !document.getElementById("time2").textContent && $rootScope.opcion==1))) {
      $ionicLoading.hide();
      alert("Completa la fecha correctamente");
  } else if ($rootScope.opcion == 0) {
      //ga('send', 'event', 'Mensaje Normal', 'click', 'Mensaje Normal');
      var contador = document.getElementById("countEs").value;
      //normales
      //Si dice escribir ponemos el mensaje vacÃ­o
      if (contador == "")
          contador = "";
      for (var i = 0; i < redesAdd.length; i++) {
          var idAccountAdd = '';
          var userTempName = '';
          if (typeof redesAdd[i]['idAccount'] != "undefined") {
              idAccountAdd = redesAdd[i]['idAccount'];
          }
          if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "tw") {
              var urlPostMassive = 'http://bamboostr.com/twitter/post-media.php';
              userTempName = redesAdd[i]['name'];
          }
          else if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "fa") {
              var urlPostMassive = 'http://bamboostr.com/facebook/post-message.php';
              userTempName = redesAdd[i]['name'];
          }
          if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "in" && image == "") {
              $ionicLoading.hide();
              alert("Instagram necesita imagen");
          } else if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "in" && image != "") {
              function getBase64Image(img) {
                  var canvas = document.createElement("canvas");
                  console.log(img.src);
                  canvas.width = img.width;
                  canvas.height = img.height;
                  var ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, img.width, img.height);
                  var dataURL = canvas.toDataURL("image/png");
                  return dataURL;
              }
              
              var data = getBase64Image(document.getElementById('imagenPre'));
              console.log(data);
              //data:image/jpeg;base64,/
              Instagram.share(data, contador, function (err) {
                  if (err) {
                      // Didn't work
                      console.log(err);
                      //alert("ERROR Instagram" + err);
                      finishSend++;
                      $ionicLoading.hide();
                      
                      
                  } else {
                      //work
                      finishSend++;
                      if (finishSend == redesAdd.length) {
                          alert("Se ha enviado el Mensaje a todos Los destinatarios");
                          //document.getElementById("countES").value = "";
                          $rootScope.modal.remove();
                          imagenes = '';
                          $ionicLoading.hide();
                          redesAdd = [];
                      }
                  }
              });
          } else {
              var parametros = {
                  images: image, description: contador,
                  identify: redesAdd[i]['id'].substr(0, redesAdd[i]['id'].length - 2),
                  idPost: idAccountAdd.substr(0, idAccountAdd.length - 2),
                  screen_name: userTempName
              };
              $http.get(urlPostMassive, { cache: false, params: parametros })
                               .then(function (response) {
                                   var response = response.data;
                                   console.log(response);
                                   /*
                                   indexOf is not defined
                      if (response.indexOf("|") != "-1")
                        responseArray = response.split("|");
                      if (response.indexOf("does not have permission to post photos on this page") != "-1") {
                          alert("Error al Enviar: No tienes Permisos para publicar Fotos. " + responseArray[1]);
                      } else if (response.indexOf("misusing this feature") != "-1") {
                          alert("Error al Enviar: Has violado las políticas de Facebook tras mandar mensajes masivos. Ésta cuenta será Suspendida por un periodo temporal. Recomendaciones: 1. Aumente el Tiempo de intervalo entre mensajes enviados y/ó Disminuya La cantidad de Mensajes enviados. 2. Recomendamos Mandar un mensaje a 25 Grupos cada 30 Minutos. " + responseArray[1]);
                      } else if (response.indexOf("Permissions error") != "-1") {
                          alert("Error al Enviar: No tienes Permisos para publicar. " + responseArray[1]);
                      } else if (response.indexOf("Unsupported post request") != "-1") {
                          alert("Error al Enviar: Petición no Soportada. " + responseArray[1]);
                      } else if (response.indexOf("An unknown error") != "-1") {
                          alert("Error al Enviar: ERROR Desconocido. " + responseArray[1]);
                      } else if (response.indexOf("This app has been restricted from uploading photos") != "-1") {
                          alert("Error al Enviar: Ésta App tiene restricciones al subir imágenes con Texto incluido. Porfavor Retire el texto de la imágen. " + responseArray[1]);
                      } else if (response.indexOf("Status is over 140 characters") != "-1") {
                          alert("Su mensaje No se Envió. Exceso de Caracteres.");
                      } else if (response.indexOf("false") != "-1" && response.indexOf("created_at") == "-1") {
                          alert("Error al Enviar: " + responseArray[0] + ". " + responseArray[1]);
                      }
                      */
                                   finishSend++;
                                   if (finishSend == redesAdd.length) {
                                       alert("Se ha enviado el Mensaje a todos Los destinatarios");
                                       //document.getElementById("countES").value = "";
                                       $rootScope.modal.remove();
                                       imagenes = '';
                                       $ionicLoading.hide();
                                       redesAdd = [];
                                   }
                               }, function (response) {
                                   /*ERROR*/
                                   alert("ERROR");
                                   finishSend++;
                                   $ionicLoading.hide();
                               });
          }
      }
  } else {
      //ga('send', 'event', 'Mensaje Programado', 'click', 'Mensaje Programado');
      var contador = document.getElementById("countEs").value;
      //programados
      var timePrArray = document.getElementById("time2").textContent.toString();
      console.log(timePrArray);
      var timePr, timePrH, timePrMArray, timePrM = [];
      timePr = timePrArray.split(":");
      console.log(timePr);
      timePrH = timePr[0];
      timePrMArray = timePr[1].split(" ");
      timePrM = timePrMArray[0];
      var timeP = timePrH + "" + timePrM;
      var date = new Date();
      var timeRFecha = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      var timeR = date.getHours() + "" + date.getMinutes() + " ";

      var timeRFechaParse = monthNames[parseInt(date.getMonth())] + " " + date.getDate() + ", " + date.getFullYear();
      var timePFechaArray = document.getElementById("dateShow").textContent.split("-");
      var timePFechaParse = monthNames[parseInt(timePFechaArray[1] - 1)] + " " + timePFechaArray[0] + ", " + timePFechaArray[2];

      if (Date.parse(timePFechaParse) >= Date.parse(timeRFechaParse)) {
          if (parseInt(timeP) > parseInt(timeR) && (Date.parse(timePFechaParse) == Date.parse(timeRFechaParse)) || (Date.parse(timePFechaParse) > Date.parse(timeRFechaParse))) {
              $rootScope.opcion = 1;
              //Si dice escribir ponemos el mensaje vacÃ­o
              if (contador == "")
                  contador = "";
              for (var i = 0; i < redesAdd.length; i++) {
                  var idAccountAdd = '';
                  var userTempName = '';
                  var redMsg = '';
                  if (typeof redesAdd[i]['idAccount'] != "undefined") {
                      idAccountAdd = redesAdd[i]['idAccount'];
                  }
                  if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "tw") {
                      if ($rootScope.opcion == 1) {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-program-message.php';
                      } else {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-draft-message.php';
                      }
                      userTempName = redesAdd[i]['name'];
                      redMsg = 'twitter';
                  }
                  else if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "fa") {
                      if ($rootScope.opcion == 1) {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-program-message.php';
                      } else {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-draft-message.php';
                      }
                      userTempName = redesAdd[i]['name'];
                      redMsg = 'facebook';
                  }
                  else if (redesAdd[i]['id'].substr(redesAdd[i]['id'].length - 2, redesAdd[i]['id'].length) == "in") {
                      if ($rootScope.opcion == 1) {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-program-message.php';
                      } else {
                          var urlPostMassive = 'http://bamboostr.com/scripts/post-draft-message.php';
                      }
                      userTempName = redesAdd[i]['name'];
                      redMsg = 'instagram';
                  }
                  var fecha = document.getElementById("dateShow").textContent + " " +
                              timePrH + ":" + timePrM;
                  var parametros = {
                      images: image, description: contador,
                      identify: redesAdd[i]['id'].substr(0, redesAdd[i]['id'].length - 2),
                      idPost: idAccountAdd.substr(0, idAccountAdd.length - 2),
                      screen_name: userTempName, fecha: fecha, red: redMsg, id_token: $rootScope.id_token,
                      horario: husoHorario, image_profile: redesAdd[i]['image']
                  };
                  $http.get(urlPostMassive, { cache: false, params: parametros })
                           .then(function (response) {
                          finishSend++;
                          if (finishSend == redesAdd.length) {
                              alert("Mensaje(s) Programado(s) Correctamente");
                              //document.getElementById("countEs").value = "";
                              $rootScope.modal.remove();
                              imagenes = '';
                              $ionicLoading.hide();
                              redesAdd = [];
                              window.location = "in.html";
                          }
                     }, function (response) {
                         /*ERROR*/
                         alert("ERROR");
                         finishSend++;
                         $ionicLoading.hide();
                  });
              }//fin for
          } else {
              alert("La hora Del Mensaje esta mal.");
              $ionicLoading.hide();
          }
      } else {
          alert("La Fecha Del Mensaje esta mal.");
          $ionicLoading.hide();
      }
  }
  
};