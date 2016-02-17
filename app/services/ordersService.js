'use strict';
app.factory('ordersService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getOrders = function () {

        return $http.get(serviceBase + 'api/orders').then(function (results) {
            return results;
        });
    };


    var _getScannedValue=function()
    {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(function (result) {



           return result.text;


        }, function (error) {
            alert("Scanning failed: ", error);
        });
    }
     

    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.getScannedValue = _getScannedValue;

    return ordersServiceFactory;

}]);