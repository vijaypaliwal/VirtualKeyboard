'use strict';

app.controller('mainmenuController', ['$scope', '$location', 'authService', 'ngAuthSettings', 'log', function ($scope, $location, authService, ngAuthSettings, log) {

    _CurrentUrl = "MainMenu";
 
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $(document).ready(function () {
        getAppVersion(function (version) {

            $(".versiontextlabel").html(version)

        });
    });
   

}]);
