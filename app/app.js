
var app = angular.module('AngularAuthApp', ['ngRoute', 'ngSanitize', 'LocalStorageModule', 'angular-loading-bar', 'ngCordova', 'ui.sortable']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });

    $routeProvider.when("/mainmenu", {
        controller: "mainmenuController",
        templateUrl: "app/views/mainmenu.html"
    });

    $routeProvider.when("/help", {
        controller: "helpController",
        templateUrl: "app/views/help.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html"
    });

    $routeProvider.when("/detail", {
        controller: "detailController",
        templateUrl: "app/views/detail.html"
    });

    $routeProvider.when("/mobileorder", {
        controller: "mobileorderController",
        templateUrl: "app/views/mobileorder.html"
    });

    $routeProvider.when("/setting", {
        controller: "settingController",
        templateUrl: "app/views/setting.html"
    });

    $routeProvider.when("/uom", {
        controller: "uomController",
        templateUrl: "app/views/uom.html"
    });

    $routeProvider.when("/status", {
        controller: "statusController",
        templateUrl: "app/views/status.html"
    });

    $routeProvider.when("/Location", {
        controller: "LocationController",
        templateUrl: "app/views/Location.html"
    });

    $routeProvider.when("/profile", {
        controller: "profileController",
        templateUrl: "app/views/profile.html"
    });

    $routeProvider.when("/activity", {
        controller: "activityController",
        templateUrl: "app/views/activity.html"
    });

    $routeProvider.when("/inventory", {
        controller: "inventoryController",
        templateUrl: "app/views/inventory.html"
    });

    $routeProvider.when("/FindItems", {
        controller: "FindItemsController",
        templateUrl: "app/views/FindItems.html"
    });

    $routeProvider.when("/item", {
        controller: "itemController",
        templateUrl: "app/views/item.html"
    });

    $routeProvider.when("/InventoryHistory", {
        controller: "InventoryHistoryController",
        templateUrl: "app/views/InventoryHistory.html"
    });


    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
     controller: "tokensManagerController",
     templateUrl: "app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
       controller: "associateController",
      templateUrl: "app/views/associate.html"
    });

    $routeProvider.when("/reportmenu", {
        controller: "reportmenuController",
        templateUrl: "app/views/reportmenu.html"
    });

    $routeProvider.when("/currentinventory", {
        controller: "currentinventoryController",
        templateUrl: "app/views/currentinventory.html"
    });

    $routeProvider.when("/inventoryactivity", {
        controller: "inventoryactivityController",
        templateUrl: "app/views/inventoryactivity.html"
    });

    $routeProvider.when("/itemreport", {
        controller: "itemreportController",
        templateUrl: "app/views/itemreport.html"
    });

    $routeProvider.when("/LocalRestock", {
        controller: "LocalrestockController",
        templateUrl: "app/views/LocalRestock.html"
    });
    

    $routeProvider.otherwise({ redirectTo: "/login" });

});

//var serviceBaseUrl = 'http://localhost:7440/';
var serviceBaseUrl = 'https://test.inventory4.com/';
var serviceBase = 'https://test.inventory4.com/API/ClearlyInventoryAPI.svc/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});


app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

// factory for all messages 
app.factory('log', function () {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-top-right',
    };
    return {
        success: function (text) {
            toastr.success(text, "Success");
        },
        error: function (text) {
            toastr.error(text, "Error");
        },
        info: function (text) {
            toastr.info(text, "Info");
        },
        warning: function (text) {
            toastr.warning(text, "Warning");
        },
    };
});


 