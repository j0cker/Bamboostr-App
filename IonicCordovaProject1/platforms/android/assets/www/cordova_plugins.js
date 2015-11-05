cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.0.1",
    "cordova-plugin-console": "1.0.1",
    "cordova-plugin-statusbar": "1.0.1",
    "ionic-plugin-keyboard": "1.0.7",
    "org.apache.cordova.splashscreen": "1.0.0",
    "cordova-plugin-whitelist": "1.0.0",
    "org.apache.cordova.inappbrowser": "0.6.0"
}
// BOTTOM OF METADATA
});