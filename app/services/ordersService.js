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
        alert("Into scanning function");
        var _resultValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(function (result) {
            alert("After return result");
            _resultValue= result.text;

        }, function (error) {
            alert("Scanning failed: ", error);
        });

        return _resultValue;
    }
     

    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.getScannedValue = _getScannedValue;

    return ordersServiceFactory;

}]);