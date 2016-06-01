'use strict';
app.controller('uomController', ['$scope',  'localStorageService', 'authService', '$location', 'log', function ($scope,  localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.mode = 1;
    $scope.UomID = 0;
    $scope.UOMToCreate = "";
    $scope.IsProcessing = false;
    $scope.LocationsLoaded = false;
  
    $scope.CurrentID = "";
    $scope.mainObjectToSend = [];
    function init() {
        $scope.getuom();
        $scope.$apply();

       
    }

    $scope.FilterRecordsLength = {length:0};
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.SearchData = { test: "" };

    $scope.ClearFilter = function () {
        $scope.SearchData = { test: "" };
        $scope.$apply();
    }

    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
      
    }

    $scope.addUOM = function () {
        $scope.UomID = 0;
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
            $scope.IsProcessing = true;

            $.ajax({
                url: serviceBase + "CreateEditUOM",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMModel": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                    $scope.IsProcessing = false;
                    if (result.CreateEditUOMResult.Payload == 1) {
                        if ($scope.mode == 2) {
                            ShowSuccess("Added");
                        }

                        if ($scope.mode == 3) {
                            ShowSuccess("Updated");
                        }

                        $scope.getuom();

                        $scope.mode = 1;

                    }

                    if (result.CreateEditUOMResult.Payload == 0) {

                        log.warning("Already exist");

                    }


                

                },
                error: function (err) {
                    $scope.IsProcessing = false;
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

        var _id = "#Delete_" + id;

        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {

                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteUOM",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "UOMID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {
                        $(_id).find("i").removeClass("fa-spin");
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
                        $(_id).find("i").removeClass("fa-spin");
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