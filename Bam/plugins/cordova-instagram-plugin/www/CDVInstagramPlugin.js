

var exec = require('cordova/exec');

var hasCheckedInstall,
    isAppInstalled;

function shareDataUrl(dataUrl, caption, callback) {
  var imageData = dataUrl.replace(/data:image\/(png|jpeg);base64,/, "");
  console.log("insAPI2: "+dataUrl);

  exec(function () {
    if (cordova && cordova.plugins && cordova.plugins.clipboard && caption !== '') {
      cordova.plugins.clipboard.copy(caption);
    }

    callback && callback(null, true);
  },

  function (err) {
    callback && callback(err);
  }, "Instagram", "share", [imageData, caption]);
}

var Plugin = {
  // calls to see if the device has the Instagram app
  isInstalled: function (callback) {
    exec(function (version) {
      hasCheckedInstall = true;
      isAppInstalled = true;
      callback && callback(null, version ? version : true);
    },

    function () {
      hasCheckedInstall = true;
      isAppInstalled = false;
      callback && callback(null, false);
    }, "Instagram", "isInstalled", []);
  },
  share: function () {
   console.log(data);
    var data,
        caption,
        callback;

    switch(arguments.length) {
    case 2:
      data = arguments[0];
      caption = '';
      callback = arguments[1];
      break;
    case 3:
      data = arguments[0];
      caption = arguments[1];
      callback = arguments[2];
      break;
    default:
    }

    // sanity check
    if (hasCheckedInstall && !isAppInstalled) {
      console.log("oops, Instagram is not installed ... ");
      return callback && callback("oops, Instagram is not installed ... ");
    }
    
    var canvas = document.getElementById(data),
        magic = "data:image";

    if (canvas) {
      shareDataUrl(canvas.toDataURL(), caption, callback);
    }
    else if (data.slice(0, magic.length) == magic) {
      console.log(arguments);
      console.log("InsApi1: " + data + " " + caption);
      shareDataUrl(data, caption, callback);
    }
    else
    {
      console.log("oops, Instagram image data string has to start with 'data:image'.")
    }
  }
};

module.exports = Plugin;
