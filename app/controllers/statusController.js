'use strict';
app.controller('statusController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CurrentInventory = {};
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.ImageList = [];
    $scope.slide = 0;
    $scope.Totalslides = 0;
    $scope.listview = true;
    $scope.StatusID = 0;
    $scope.mode = 1;
    $scope.StatusToCreate = "";

    $scope.LocationsLoaded = false;



    $scope.mainObjectToSend = [];
    function init() {

        $scope.getstatus();



        $scope.$apply();
    }

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");


    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');

    }
    $scope.getstatus = function () {


        $scope.LocationsLoaded = false;


        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetStatus',
               contentType: 'application/json; charset=utf-8',
               dataType: 'json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
               success: function (response) {
                   $scope.LocationsLoaded = true;
                    

                   $scope.StatusList = response.GetStatusResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {
                   $scope.LocationsLoaded = true;
                   log.error(err.Message);

               }
           });

    }


    $scope.addstatus = function () {
        $scope.StatusToCreate = "";
        $scope.mode = 2;
        $scope.StatusID = 0;

        $scope.$apply();
    }


    $scope.editstatus = function (obj) {

         

        $scope.mode = 3;

        $scope.StatusToCreate = obj.StatusValue;
        $scope.StatusID = obj.StatusId;
        $("#StatusToCreate").val($scope.StatusToCreate);
        $scope.$apply();

    }

    $scope.savestatus = function () {

        var _StatusValue = $.trim($("#StatusToCreate").val());

        if (_StatusValue != "") {

            $scope.StatusToCreate = $("#StatusToCreate").val();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                $scope.SecurityToken = authData.token;
            }
            $scope.IsProcessing = true;
            var datatosend = { "StatusId": $scope.StatusID, "StatusValue": $scope.StatusToCreate };

            console.log(datatosend);

            $.ajax({
                url: serviceBase + "CreateEditStatus",
                type: 'POST',
                data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "_StatusVM": datatosend }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {

                    $scope.IsProcessing = false;
                    if (result.CreateEditStatusResult.Payload == 1) {
                        if ($scope.mode == 2) {
                            ShowSuccess("Added");
                        }

                        if ($scope.mode == 3) {
                            ShowSuccess("Updated");
                        }

                        $scope.getstatus();

                        $scope.mode = 1;

                    }

                    if (result.CreateEditStatusResult.Payload == 0) {

                        log.warning("Already exist");

                    }
                   

                 
                   

                },
                error: function (err) {
                    $scope.IsProcessing = false;
                    alert("Error");
                     

                },
                complete: function () {
                }

            });

        }

    }


    $scope.deletestatus = function (obj) {


        var id = obj.StatusId;
         
        var _id = "#Delete_" + id;
        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                $(_id).find("i").addClass("fa-spin");
                $.ajax({
                    url: serviceBase + "DeleteStatus",
                    type: 'POST',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "StatusID": id }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {

                        $(_id).find("i").removeClass("fa-spin");

                        if (result.DeleteStatusResult.Payload == 1) {
                            ShowSuccess("Deleted");

                        }

                        if (result.DeleteStatusResult.Payload == 0) {

                            log.info("unable to delete, this value used by system")

                        }











                        $scope.getstatus();

                        $scope.mode = 1;

                    },
                    error: function (err) {
                        $(_id).find("i").removeClass("fa-spin");
                        alert("Error");
                         

                    },
                    complete: function () {
                    }

                });
            }
        });

    }

    $scope.leaveform = function() {
        $scope.mode = 1;
        $scope.$apply();
    }



    init();





}]);