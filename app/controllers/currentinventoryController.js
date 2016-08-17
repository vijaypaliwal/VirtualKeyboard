﻿'use strict';
app.controller('currentinventoryController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {


    $scope.CurrentView = { Name: "Current Inventory" };
    $scope.InventoryViews = [];
    $scope.InventoryList = [];
    $scope.CustomItemDataList = [];
    $scope.FilterData = {SearchValue:""};
    $scope.isDataLoading = true;
    $scope.FilterArray = [{ColumnName :"" ,FilterOperator:"",SearchValue :""}];
    var _sortColumn = "iLastITID";
    var _sortDir = "DESC";
    $scope.isviewload = false;
    var _IsLazyLoadingUnderProgress = 0;
    var _PageSize = 30;
    $scope.Columns = [];
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

    function TryParseInt(str, defaultValue) {
        var retValue = defaultValue;
        if (str !== null) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
    }

    function GetFilterOperator(ColumnName)
    {
        debugger;
        
        switch (ColumnName.toLowerCase()) {
            case "date":
            case "datetime":
                return "date-eq";
                break;
            case "number":
            case "decimal":
            case "money":
                return "num-eq";
                break;


            default:
                return "cn";
        }
    }

    $scope.isFurtherCalculatedColumn=function(ColumnName)
    {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == ColumnName) {
                if ($scope.Columns[i].isFirstFurtherCalculated == true || $scope.Columns[i].isSecondFurtherCalculated == true)
                {
                    return true;

                }
            }

        }
        return false;
    }
    $scope.clearfilterArray = function () {
        for (var i = 0; i < $scope.FilterArray.length; i++) {
            $scope.FilterArray[i].SearchValue = "";
        }
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }
    $scope.clearfilter=function()
    {
        $scope.FilterData.SearchValue = "";
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }
    $scope.GetComboData=function(ColumnName)
    {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
                console.log($scope.CustomItemDataList[i].cfdComboValues);
                return $scope.CustomItemDataList[i].cfdComboValues;
            }

        }
        
    }
    $scope.GetDisplayLabel = function (ColumnName) {
        var DataType=""
        

        DataType = $scope.GetCustomFieldNameByMap(ColumnName);
        if (DataType == "N/A") {
            for (var i = 0; i < $scope.Columns.length; i++) {
                if ($scope.Columns[i].ColumnID == ColumnName) {
                    return $scope.Columns[i].DisplayLabel;
                }

            }
        }
        else {
            return DataType;
        }
    }

    $scope.GetColumnDataType=function(ColumnName)
    {
        var DataType=""
        

            DataType = $scope.GetCustomFieldTypeByID(ColumnName);
        if(DataType=="N/A") {

            for (var i = 0; i < $scope.Columns.length; i++) {
                if ($scope.Columns[i].ColumnID == ColumnName) {
                    DataType = $scope.Columns[i].ColumnDataType.toLowerCase();
                    return DataType;
                }

            }
        }
        else {
            return DataType;
        }
    }

    function UpdateFilterArray()
    {

        for (var i = 0; i < $scope.FilterArray.length; i++) {

            var _datatype = $scope.GetColumnDataType($scope.FilterArray[i].ColumnName);

            if(_datatype=="number"||_datatype=="decimal"||_datatype=="money")
            {
                if($scope.FilterArray[i].SearchValue!=null && $scope.FilterArray[i].SearchValue!=undefined && $.trim($scope.FilterArray[i].SearchValue)!="")
                {
                    var _value = angular.copy($scope.FilterArray[i].SearchValue);
                    $scope.FilterArray[i].SearchValue = parseFloat(_value);
                }

            }
        }
        CheckScopeBeforeApply();
    }
    function FillFilterArray()
    {
        $scope.FilterArray = [];
        for (var i = 0; i < $scope.Columns.length; i++) {
         
            if ($scope.Columns[i].ColumnID != "LeaveBlank") {
                var _obj = { ColumnName: "", FilterOperator: "", SearchValue: "" };
                _obj.ColumnName = $scope.Columns[i].ColumnID;
                var _ID = TryParseInt(_obj.ColumnName, 0);
                if (_ID != 0)
                {
                  
                    _obj.ColumnName = $scope.GetCustomFieldByID(_ID);
                }
                _obj.FilterOperator = GetFilterOperator($scope.Columns[i].ColumnDataType);
                _obj.SearchValue = "";
                $scope.FilterArray.push(_obj);
            }

        }

        
        CheckScopeBeforeApply();
    }

    $(window).scroll(function () {
        //var _SearchValue = $.trim($("#MasterSearch").val());
        if (isviewload == true) {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if (_PageSize < $scope.totalrecords) {


                        _IsLazyLoadingUnderProgress = 1;
                        $scope.isDataLoading = false;
                        _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                        CheckScopeBeforeApply();
                        $scope.GetInventoryDataAccordingToView();
                    }
                    else {
                        // log.info("You have already loaded all data.")
                    }

                }
            }
        }



    });
    function ChangeIntoNumberFormat(number) {
        if (number != undefined && number != null && number != "") {

            if (number % 1 != 0) {

                var arr = number.toString().split(".");
                var _tempNumber = number;
                var _tempNumbertoconvert = Math.floor(number);
                var tosend_tempNumbertoconvert = _tempNumbertoconvert.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var _newArr = tosend_tempNumbertoconvert.split(".");
                var _finallytoSendValue = _newArr[0] += "." + arr[1];
                return _finallytoSendValue;

            }
            else {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            }
        }
        else {
            return number;
        }
    }
    $scope.GetCustomDataField = function (Type) {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }




        $.ajax
           ({
               type: "POST",
               url: serviceBase + 'GetCustomFieldsData',
               contentType: 'application/json; charset=utf-8',
               dataType: 'text json',
               data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "Type": Type }),
               success: function (response) {


                   


                  
                       $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                      

                   CheckScopeBeforeApply()
               },
               error: function (response) {
                   log.error(response.statusText);
                   //$scope.InventoryObject.Location = 678030;
               }
           });
    }
    $scope.GetCustomFieldByID = function (ID) {
        
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if($scope.CustomItemDataList[i].cfdID==ID)
            {
                return $scope.CustomItemDataList[i].ColumnMap;
            }

        }
    }

    $scope.GetCustomFieldNameByMap = function (ID) {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdName;
            }

        }

        return _return;
    }

    $scope.GetCustomFieldTypeByID=function(ID)
    {
        var _return = "N/A";
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ID) {
                return $scope.CustomItemDataList[i].cfdDataType;
            }

        }

        return _return;
    }
   $scope.GetCellData=function(columnName, Index,isCalculated) {
       var _ID = TryParseInt(columnName, 0);
       if (_ID != 0)
       {
           columnName = $scope.GetCustomFieldByID(_ID);
       }
       var _Tempcolumnname = columnName;
       if (isCalculated == true)
       {
           columnName="Calculated"
       }

       switch (columnName) {
           case "Calculated":
               var _valueData = "";
               if ($scope.InventoryList[Index].CustomData != null && $scope.InventoryList[Index].CustomData != undefined)
                   for (var i = 0; i < $scope.InventoryList[Index].CustomData.length; i++) {
                       if( $scope.InventoryList[Index].CustomData[i].Key==_Tempcolumnname)
                       {
                           
                           _valueData = $scope.InventoryList[Index].CustomData[i].Value;
                           break;
                       }
               }
               return _valueData;
               break;
               
           case "iLastAction":
               return $scope.InventoryList[Index].iLastAction != null ? $scope.InventoryList[Index].iLastAction : "";
               break;
           case "pTargetQty":
               return $scope.InventoryList[Index].pTargetQty != null ? $scope.InventoryList[Index].pTargetQty : "";
               break;
           case "pReorderQty":
               return $scope.InventoryList[Index].pReorderQty != null ? $scope.InventoryList[Index].pReorderQty : "";
               break;
           case "ExtendedCost":

               return $scope.InventoryList[Index].ExtendedCost != null ? $scope.InventoryList[Index].ExtendedCost : "";
               break;
            case "pPart":

                return $scope.InventoryList[Index].pPart != null ? $scope.InventoryList[Index].pPart : "";
                break;
            case "iQty":
                return $scope.InventoryList[Index].iQty;
                break;
            case "pDescription":
                return $scope.InventoryList[Index].pDescription != null ? $scope.InventoryList[Index].pDescription : "";

                break;
            case "uomUOM":
                return $scope.InventoryList[Index].uomUOM != null ? $scope.InventoryList[Index].uomUOM : "";
                break;
            case "iUniqueDate":
                return $scope.InventoryList[Index].iUniqueDate != null ? $scope.InventoryList[Index].iUniqueDate : "";
                break;
            case "lLoc":
                return $scope.InventoryList[Index].lLoc != null ? $scope.InventoryList[Index].lLoc : "";
                break;
            case "lZone":
                return $scope.InventoryList[Index].lZone != null ? $scope.InventoryList[Index].lZone : "";
                break;

            case "iStatusValue":
                return $scope.InventoryList[Index].iStatusValue != null ? $scope.InventoryList[Index].iStatusValue : "";
                break;

            case "iUnitNumber2":
                return $scope.InventoryList[Index].iUnitNumber2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].iUnitNumber2) : "";
                break;
            case "iUnitNumber1":
                return $scope.InventoryList[Index].iUnitNumber1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].iUnitNumber1) : "";
                break;
            case "iUnitDate2":

                return $scope.InventoryList[Index].iUnitDate2 != null ? $scope.InventoryList[Index].iUnitDate2 : "";
                break;

            case "iCostPerUnit":
                return $scope.InventoryList[Index].AvgCostPerUnit != null ? $scope.InventoryList[Index].AvgCostPerUnit : "";

                break;
            case "iUnitTag3":
                return $scope.InventoryList[Index].iUnitTag3 != null ? $scope.InventoryList[Index].iUnitTag3 : "";
                break;
            case "iUnitTag2":
                return $scope.InventoryList[Index].iUnitTag2 != null ? $scope.InventoryList[Index].iUnitTag2 : "";
                break;

            case "HasConversion":
                return $scope.InventoryList[Index].HasConversion;
                break;

            case "string_1":
                return $scope.InventoryList[Index].string_1 != null ? $scope.InventoryList[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.InventoryList[Index].string_2 != null ? $scope.InventoryList[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.InventoryList[Index].string_3 != null ? $scope.InventoryList[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.InventoryList[Index].string_4 != null ? $scope.InventoryList[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.InventoryList[Index].string_5 != null ? $scope.InventoryList[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.InventoryList[Index].string_6 != null ? $scope.InventoryList[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.InventoryList[Index].string_7 != null ? $scope.InventoryList[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.InventoryList[Index].string_8 != null ? $scope.InventoryList[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.InventoryList[Index].string_9 != null ? $scope.InventoryList[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.InventoryList[Index].string_10 != null ? $scope.InventoryList[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.InventoryList[Index].string_11 != null ? $scope.InventoryList[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.InventoryList[Index].string_12 != null ? $scope.InventoryList[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.InventoryList[Index].string_13 != null ? $scope.InventoryList[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.InventoryList[Index].string_14 != null ? $scope.InventoryList[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.InventoryList[Index].string_15 != null ? $scope.InventoryList[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.InventoryList[Index].string_16 != null ? $scope.InventoryList[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.InventoryList[Index].string_17 != null ? $scope.InventoryList[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.InventoryList[Index].string_18 != null ? $scope.InventoryList[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.InventoryList[Index].string_19 != null ? $scope.InventoryList[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.InventoryList[Index].string_20 != null ? $scope.InventoryList[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.InventoryList[Index].string_21 != null ? $scope.InventoryList[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.InventoryList[Index].string_22 != null ? $scope.InventoryList[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.InventoryList[Index].string_23 != null ? $scope.InventoryList[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.InventoryList[Index].string_24 != null ? $scope.InventoryList[Index].string_24 : "";
                break;






            case "number_1":
                return $scope.InventoryList[Index].number_1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.InventoryList[Index].number_2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.InventoryList[Index].number_3 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.InventoryList[Index].number_4 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.InventoryList[Index].number_5 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.InventoryList[Index].number_6 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.InventoryList[Index].number_7 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.InventoryList[Index].number_8 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.InventoryList[Index].number_9 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.InventoryList[Index].number_10 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.InventoryList[Index].number_11 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.InventoryList[Index].number_12 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_12) : "";
                break;

            case "bool_1":
                return $scope.InventoryList[Index].bool_1 != null ? $scope.InventoryList[Index].bool_1 : "";
                break;
            case "bool_2":
                return $scope.InventoryList[Index].bool_2 != null ? $scope.InventoryList[Index].bool_2 : "";
                break;
            case "bool_3":
                return $scope.InventoryList[Index].bool_3 != null ? $scope.InventoryList[Index].bool_3 : "";
                break;
            case "bool_4":
                return $scope.InventoryList[Index].bool_4 != null ? $scope.InventoryList[Index].bool_4 : "";
                break;
            case "bool_5":
                return $scope.InventoryList[Index].bool_5 != null ? $scope.InventoryList[Index].bool_5 : "";
                break;
            case "bool_6":
                return $scope.InventoryList[Index].bool_6 != null ? $scope.InventoryList[Index].bool_6 : "";
                break;

            case "date_1":
                return $scope.InventoryList[Index].date_1 != null ? $scope.InventoryList[Index].date_1 : "";
                break;
            case "date_2":
                return $scope.InventoryList[Index].date_2 != null ? $scope.InventoryList[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.InventoryList[Index].date_3 != null ? $scope.InventoryList[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.InventoryList[Index].date_4 != null ? $scope.InventoryList[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.InventoryList[Index].date_5 != null ? $scope.InventoryList[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.InventoryList[Index].date_6 != null ? $scope.InventoryList[Index].date_6 : "";
                break;

            case "pCountFrq":
                return $scope.InventoryList[Index].pCountFrq != null ? $scope.InventoryList[Index].pCountFrq : "";
                break;
            case "lZone":
                return $scope.InventoryList[Index].lZone != null ? $scope.InventoryList[Index].lZone : "";
                break;
            case "iReqValue":
                return $scope.InventoryList[Index].iReqValue != null ? $scope.InventoryList[Index].iReqValue : "";
                break;
            default:
                return "N/A";
        }
    }
   $scope.ShowHideDiv=function(id)
   {
       var _id = "#row_" + id.toString();
       var _iconID = "#icon_" + id.toString();
       if ($(_iconID).hasClass("fa-chevron-up"))
       {
        $(_iconID).removeClass("fa-chevron-up").addClass("fa-chevron-down");
        }
       else {
           $(_iconID).removeClass("fa-chevron-down").addClass("fa-chevron-up");
       }
      
       $(_id).find(".ExtraTr").toggle("slow");
   }
    $scope.GetInventoryViews = function () {
        $scope.isDataLoading = false;
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
              success: function (response)
              {
                  $scope.isDataLoading = true;
              $scope.InventoryViews = response.GetAllViewsResult.Payload;
              $scope.$apply();
              },
              error: function (err) {
                  $scope.isDataLoading = true;
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
        $scope.FilterArray = [];
        CheckScopeBeforeApply();
    }

    $scope.showview = function() {
        $scope.isviewload = false;
        $scope.CurrentView = { Name: "Current Inventory" };
    }

    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.AssignCurrentView=function(view)
    {
        $scope.CurrentView = view;
        $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
        CheckScopeBeforeApply();
        $scope.GetInventoryDataAccordingToView();
    }


    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
    }



    $scope.GetInventoryDataAccordingToView=function()
    {
        
        $scope.isDataLoading = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $("#filtermodal").modal('hide');

        if ($scope.CurrentView != undefined) {


            if ($scope.FilterData.SearchValue != undefined && $.trim($scope.FilterData.SearchValue) != "")
            {

            }
            else {
                $scope.FilterData.SearchValue = "";
            }
            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetCurrentInventoriesNew',
                  data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, SelectedCartIDs: [], masterSearch: $scope.FilterData.SearchValue, showImage: "True", showZeroRecords: "True", PageSize: _PageSize, IsDateColumnOn: false, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;

                      debugger;
                      
                      _TotalRecordsCurrent = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                      $scope.currentrecord = response.GetCurrentInventoriesNewResult.Payload[0].Data.length;
                      $scope.InventoryList = response.GetCurrentInventoriesNewResult.Payload[0].Data;
                      $scope.totalrecords = response.GetCurrentInventoriesNewResult.Payload[0].TotalRercords;
                      $scope.Columns = response.GetCurrentInventoriesNewResult.Payload[0].Columns;
                      $scope.ActualTotalRecords = response.GetCurrentInventoriesNewResult.Payload[0].ActualTotalRecords;
                      $scope.FilterArray = response.GetCurrentInventoriesNewResult.Payload[0].Filters;
                      CheckScopeBeforeApply();
                      // FillFilterArray();
                      UpdateFilterArray();

                  },
                  error: function (err) {
                      console.log(err);
                      log.error(err.Message);
                      $scope.isDataLoading = true;
                  },
                  complete: function () {
                      _IsLazyLoadingUnderProgress = 0;
                      $scope.isDataLoading = true;
                  }
              });
             }
         }

    $scope.IsAvailableColumn=function(column)
    {
        for (var i = 0; i < $scope.Columns.length; i++) {
            if ($scope.Columns[i].ColumnID == column) {
                
                return true;
            }

        }
        return false;
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

                   $scope.UOMList = response.GetUnitsOfMeasureResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

                   log.error(err.Message);

               }
           });

    }

    $scope.getstatus = function () {

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

                   $scope.StatusList = response.GetStatusResult.Payload;
                   $scope.$apply();
               },
               error: function (err) {

               }
           });

    }

    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');

            $(".Addbtn .fa").removeClass('rotate');


        }
        else {
            $("#myModal2").modal('show');
            $(".Addbtn .fa").addClass('rotate');
        }
    }

    function ToggleSortDir(Dir) {
        if (Dir == "DESC") {
            return "ASC"
        }
        else if (Dir == "ASC") {
            return "DESC"
        }
        else {
            return "ASC";
        }
    }
    $scope.applysorting = function (sortby) {

        var _tempCol = _sortColumn;

        _sortColumn = sortby;
        if (_tempCol == _sortColumn) {
            _sortDir = ToggleSortDir(_sortDir);

        }
        $scope.GetInventoryDataAccordingToView()
    }

    function init() {
        $scope.getuom();
        $scope.getstatus();
        $scope.GetInventoryViews();
        $scope.GetCustomDataField(0);
        CheckScopeBeforeApply();
      
    
    }

    init();
}]);