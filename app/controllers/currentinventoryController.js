'use strict';
app.controller('currentinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.CurrentView = {Name:"Current Inventory"}
    $scope.InventoryViews = [];
    $scope.InventoryList = [];
    $scope.FilterArray = [{ColumnName :"" ,FilterOperator:"",SearchValue :""}];
    var _sortColumn = "iLastITID";
    var _sortDir = "DESC";
    $scope.isviewload = false;
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    var _TotalRecordsCurrent = 0;
    var _masterSearch = "";
    function getIncrementor(_Total) {
        if (_Total <= 100) {
            return 10;
        }
        else if (_Total > 100 && _Total < 500) {
            return 20;
        }
        else if (_Total > 500) {
            return 50;
        }
        else {
            return 10;
        }
    }
    $(window).scroll(function () {
        //var _SearchValue = $.trim($("#MasterSearch").val());
        if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
            if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                if (_PageSize < $scope.totalrecords) {
                    debugger;
                    _IsLazyLoadingUnderProgress = 1;
                    _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                    CheckScopeBeforeApply();
                    $scope.GetInventoryDataAccordingToView();
                }
                else {
                    // log.info("You have already loaded all data.")
                }

            }
        }



    });
  
    $scope.GetInventoryViews = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 1 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {

                  debugger;


                  $scope.InventoryViews = response.GetAllViewsResult.Payload;

                  $scope.$apply();

              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");
                  $scope.errorbox(err);
                  $scope.$apply();

              }
          });

    }


    $scope.viewdetail = function(viewname) {
        $scope.isviewload = true;
        $scope.CurrentView = viewname;
    }

    $scope.showview = function() {
        $scope.isviewload = false;
        $scope.CurrentView = "Current Inventory";
    }



    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AssignCurrentView=function(view)
    {
        $scope.CurrentView = view;
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }

    $scope.GetInventoryDataAccordingToView=function()
    {
        debugger;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }



        //SecurityToken As String, ByVal pageToReturn As Integer, ByVal sortCol As String, ByVal sortDir As String, ByVal filterArray As IEnumerable(Of DataColumnFilter), Optional ByVal masterSearch As String = "", Optional ByVal ViewID As Integer = 0, Optional ByVal PageSize As Integer = 0
      

        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetCurrentInventoriesNew',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: [], SelectedCartIDs: [], masterSearch: "", showImage: "True", showZeroRecords: "True", PageSize: _PageSize, IsDateColumnOn: false, ViewID: $scope.CurrentView.GridLayoutID }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response) {
                  $scope.isviewload = true;
                  debugger;
                  _TotalRecordsCurrent = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                  $scope.currentrecord = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                  $scope.InventoryList = response.GetCurrentInventoriesNewResult.Payload[0].Data;
                  $scope.totalrecords = response.GetCurrentInventoriesNewResult.Payload[0].TotalRercords;
                  $scope.ActualTotalRecords = response.GetCurrentInventoriesNewResult.Payload[0].ActualTotalRecords;
                  CheckScopeBeforeApply();
                  console.log($scope.InventoryList);
                
              },
              error: function (err) {
                  console.log(err);
                  log.error(err.Message);

              },
              complete:function()
              {
                  _IsLazyLoadingUnderProgress = 0;
              }
          });
        

    }

    

    function init() {
        $scope.GetInventoryViews();
        CheckScopeBeforeApply();
      
    
    }

    init();
}]);