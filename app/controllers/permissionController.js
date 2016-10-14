'use strict';
app.controller('permissionController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.MyinventoryFields = [];
    $scope.UnitDataColumns = [];
    $scope.SearchString = "";
    $scope.IsLoading = false;
    $scope.LocalItemFieldsList = [];

    $scope.IsAdminopen = true;
    $scope.IsViewOpen = true;
    $scope.IsLibrarydataopen = true;
    $scope.LocalCustomItemFieldsList = [];
    $scope.LocalCustomActivityFieldsList = [];
    function init() {
      

    }

    $scope.Issearch = false;

    $scope.openClosePanel = function (Type) {
        switch (Type) {
            case 1:
                $scope.IsLibrarydataopen = !$scope.IsLibrarydataopen;
                $scope.IsViewOpen = false;
                $scope.IsAdminopen = false;
                break;
            case 2:
                $scope.IsLibrarydataopen = false;
                $scope.IsAdminopen = false;
                $scope.IsViewOpen = !$scope.IsViewOpen;
                break;
            case 3:
                $scope.IsLibrarydataopen = false;
                $scope.IsAdminopen = !$scope.IsAdminopen;
                $scope.IsViewOpen = false;
                break;
            default:

        }
        CheckScopeBeforeApply();
    }
 


    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.GoTo = function (url) {
        $location.path(url);
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
  


    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')
    });

    $scope.showfilter = function () {
        $scope.Issearch = true;
        $scope.$apply();
    }

    $scope.hidefilter = function() {
        $scope.Issearch = false;
        $scope.$apply();
    }


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('fa-times').addClass('fa-bars')


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").removeClass('fa-bars').addClass('fa-times');
        }
    }


  


    init();

    app.directive('customSwipe', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    $(element).swipe({
                        swipe: function (event, direction, distance, duration, fingerCount) {
                            //This only fires when the user swipes left
                            debugger;
                            if (direction == "left" || direction == "right") {

                                setTimeout(function () {

                                    element.find("input").trigger("click");




                                }, 10)
                            }
                        },
                        threshold: 100
                    });
                }
            };
        }
    ]);



}]);