'use strict';
app.controller('uomController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.mode = 1;
    $scope.UomID = 0;
    $scope.UOMToCreate = "";

    $scope.LocationsLoaded = false;
  

    $scope.mainObjectToSend = [];
    function init() {
        $scope.getuom();
        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
      
    }

    $scope.addUOM = function () {

        $scope.UOMToCreate = "";
        $scope.mode = 2;
        $scope.$apply();

    }
  

    $scope.getuom = function () {

        $scope.LocationsLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetUnitsOfMeasure',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.LocationsLoaded = true;
                   debugger;
                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.LocationsLoaded = true;
                   log.error(err.Message);

               }
           });

    }

   

    $scope.editUOM = function (obj) {

        debugger;

        $scope.mode = 3;

        $scope.UOMToCreate = obj.UnitOfMeasureName;
        $scope.UomID = obj.UnitOfMeasureID;
        $("#UOMToCreate").val($scope.UOMToCreate);
        $scope.$apply();

    }

    $scope.saveUOM = function () {

        var _StatusValue = $.trim($("#UOMToCreate").val());

        if (_StatusValue != "") {

            $scope.UOMToCreate = $("#UOMToCreate").val();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }

            var datatosend = { "UomID": $scope.UomID, "UOM": $scope.UOMToCreate };

            console.log(datatosend);

            $.ajax({
                url: serviceBase + "CreateEditUOM",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMModel": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {

                    if ($scope.mode == 2) {
                        ShowSuccess("Added");
                    }

                    if ($scope.mode == 3) {
                        ShowSuccess("Updated");
                    }


                    $scope.getuom();

                    $scope.mode = 1;

                },
                error: function (err) {

                    alert("Error");
                    debugger;

                },
                complete: function () {
                }

            });

        }

    }


    $scope.deleteUOM = function (obj) {

     
        var id = obj.UnitOfMeasureID;
        debugger;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {

                $.ajax({
                    url: serviceBase + "DeleteUOM",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        debugger;

                        if (result.DeleteUOMResult.Payload == 1) {
                            ShowSuccess("Deleted");

                        }

                        if (result.DeleteUOMResult.Payload == 0) {

                            log.info("unable to delete, this value used by system")

                        }

                
              

             
          
             

             


                        $scope.getuom();

                        $scope.mode = 1;

                    },
                    error: function (err) {

                        alert("Error");
                        debugger;

                    },
                    complete: function () {
                    }

                });
            }
        });

    }

    $scope.leaveform = function () {
        $scope.mode = 1;
        $scope.$apply();
    }
    init();



 

}]);