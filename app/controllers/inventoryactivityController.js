﻿'use strict';
app.controller('inventoryactivityController', ['$scope', 'localStorageService', 'authService', '$location', 'log', function ($scope, localStorageService, authService, $location, log) {

    $scope.CurrentView = { Name: "Inventory Activity" };
    $scope.ActivityViews = [];
    $scope.ActivityList = [];
    $scope.CustomItemDataList = [];
    $scope.CustomActivityDataList = [];
    $scope.FilterData = {SearchValue:""};
    $scope.isDataLoading = true;
    $scope.FilterArray = [{ ColumnName: "", FilterOperator: "", SearchValue: "" }];
    $scope.sortColumn = "itTransDate";
    $scope.sortDir = "DESC";
    var _sortColumn = "itTransDate";
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

        $scope.FilterData.SearchValue = "";
        CheckScopeBeforeApply();
        $scope.GetActivityDataAccordingToView();
    }
    $scope.clearfilter=function()
    {
        $scope.clearfilterArray();
      
      //  CheckScopeBeforeApply();
      //  $scope.GetActivityDataAccordingToView();
    }
    $scope.GetComboData=function(ColumnName)
    {
        for (var i = 0; i < $scope.CustomItemDataList.length; i++) {
            if ($scope.CustomItemDataList[i].ColumnMap == ColumnName) {
                return $scope.CustomItemDataList[i].cfdComboValues;
            }

        }
        
    }


    $('#bottommenumodal').on('hidden.bs.modal', function () {
        $(".menubtn .fa").removeClass('rotate');
    });


    $scope.Openbottommenu = function () {

        if ($("body").hasClass("modal-open")) {
            $("#bottommenumodal").modal('hide');

            $(".menubtn .fa").removeClass('rotate');


        }
        else {
            $("#bottommenumodal").modal('show');
            $(".menubtn .fa").addClass('rotate');
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
        if ($scope.isviewload == true) {

            if (_IsLazyLoadingUnderProgress === 0 && _TotalRecordsCurrent != 0) {
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if (_PageSize < $scope.totalrecords) {


                        _IsLazyLoadingUnderProgress = 1;
                        $scope.isDataLoading = false;
                        _PageSize = _TotalRecordsCurrent + getIncrementor($scope.totalrecords);
                        CheckScopeBeforeApply();
                        $scope.GetActivityDataAccordingToView();
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


                   
                   if (Type == 0)
                   {
                       $scope.CustomItemDataList = response.GetCustomFieldsDataResult.Payload;

                   }

                   if (Type == 1)
                   {
                       $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;

                   }
                  

                      

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
                if ($scope.CustomItemDataList[i].cfdCustomFieldType == "Part") {

                    return "i" + $scope.CustomItemDataList[i].ColumnMap;
                }

                if ($scope.CustomItemDataList[i].cfdCustomFieldType == "Inventory") {

                    return $scope.CustomItemDataList[i].ColumnMap;
                }
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

    $scope.GetImagePath=function(Operator)
    {
        debugger;
        var path = "img/filter/";
        var _returnPath = "img/filter/EqualTo.gif"
        switch (Operator) {
            case "eq":
            case "num-eq":
            case "date-eq":
                _returnPath = path + "EqualTo.gif";
                break;
            case "num-ne":
            case "ne":
                _returnPath = path + "NotEqualTo.gif";
                break;
            case "date-before":
                _returnPath = path + "OnOrBefore.gif";
                break;
            case "cn":
                _returnPath = path + "Contains.gif";
                break;
            case "date-after":
                _returnPath = path + "OnOrAfter.gif";
                break;
            case "bw":
                _returnPath = path + "BeginsWith.gif";
                break;
            case "num-lte":
                _returnPath = path + "LessThanOrEqualTo.gif";
                break;
            case "num-gte":
                _returnPath = path + "GreaterThanOrEqualTo.gif";
                break;
            case "date-gte":
                _returnPath = path + "GreaterThanOrEqualTo.gif";
                break;
        }
        return _returnPath;
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
               if ($scope.ActivityList[Index].CustomData != null && $scope.ActivityList[Index].CustomData != undefined)
                   for (var i = 0; i < $scope.ActivityList[Index].CustomData.length; i++) {
                       if( $scope.ActivityList[Index].CustomData[i].Key==_Tempcolumnname)
                       {
                           
                           _valueData = $scope.ActivityList[Index].CustomData[i].Value;
                           break;
                       }
               }
               return _valueData;
               break;
               
           case "lLoc":
               return $scope.ActivityList[Index].lLoc != null ? $scope.ActivityList[Index].lLoc : "";
               break;
           case "lZone":
               return $scope.ActivityList[Index].lZone != null ? $scope.ActivityList[Index].lZone : "";
               break;

               
           case "uomUOM":
               return $scope.ActivityList[Index].uomUOM != null ? $scope.ActivityList[Index].uomUOM : "";
               break;
           case "auDisplayName":
               return $scope.ActivityList[Index].auDisplayName != null ? $scope.ActivityList[Index].auDisplayName : "";
               break;
           case "itAction":
               return $scope.ActivityList[Index].itAction != null ? $scope.ActivityList[Index].itAction : "";
               break;
           case "ParentAction":
               return $scope.ActivityList[Index].ParentAction != null ? $scope.ActivityList[Index].ParentAction : "";
               break;
               
           case "itAvgCostPerUnit":
               return $scope.ActivityList[Index].itAvgCostPerUnit != null ? $scope.ActivityList[Index].itAvgCostPerUnit : "";
               break;
           case "itCostPerUnit":

               return $scope.ActivityList[Index].itCostPerUnit != null ? $scope.ActivityList[Index].itCostPerUnit : "";
               break;
           case "ItemDescription":

               return $scope.ActivityList[Index].ItemDescription != null ? $scope.ActivityList[Index].ItemDescription : "";
                break;
           case "itQty":
               return $scope.ActivityList[Index].itQty;
               break;
           case "itQtyChange":
               return $scope.ActivityList[Index].itQty;
               break;
               
           case "ItemGroup":
               return $scope.ActivityList[Index].ItemGroup != null ? $scope.ActivityList[Index].ItemGroup : "";

                break;
           case "ItemNumber":
               return $scope.ActivityList[Index].ItemNumber != null ? $scope.ActivityList[Index].ItemNumber : "";
                break;
           case "itReqValue":
               return $scope.ActivityList[Index].itReqValue != null ? $scope.ActivityList[Index].itReqValue : "";
                break;
           case "itStatusValue":
               return $scope.ActivityList[Index].itStatusValue != null ? $scope.ActivityList[Index].itStatusValue : "";
                break;
           case "iOrgName":
               return $scope.ActivityList[Index].iOrgName != null ? $scope.ActivityList[Index].iOrgName : "";
                break;

           case "ItemSupplier":
               return $scope.ActivityList[Index].ItemSupplier != null ? $scope.ActivityList[Index].ItemSupplier : "";
                break;

            case "itUnitNumber2":
                return $scope.ActivityList[Index].itUnitNumber2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].itUnitNumber2) : "";
                break;
            case "itUnitNumber1":
                return $scope.ActivityList[Index].itUnitNumber1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].itUnitNumber1) : "";
                break;
           case "ItemDefaultCost":

               return $scope.ActivityList[Index].ItemDefaultCost != null ? $scope.ActivityList[Index].ItemDefaultCost : "";
               break;

           case "ItemReorderQty":

               return $scope.ActivityList[Index].ItemReorderQty != null ? $scope.ActivityList[Index].ItemReorderQty : "";
               break;

           case "ItemTargetQty":

               return $scope.ActivityList[Index].ItemTargetQty != null ? $scope.ActivityList[Index].ItemTargetQty : "";
               break;
                
           case "ItemDefaultLocation":
               return $scope.ActivityList[Index].ItemDefaultLocation != null ? $scope.ActivityList[Index].ItemDefaultLocation : "";

               break;
           case "ItemDefaultLocationGroup":
               return $scope.ActivityList[Index].ItemDefaultLocationGroup != null ? $scope.ActivityList[Index].ItemDefaultLocationGroup : "";

               break;
               
           case "ItemDefaultUOM":
               return $scope.ActivityList[Index].ItemDefaultUOM != null ? $scope.ActivityList[Index].ItemDefaultUOM : "";
                break;
           case "itTransDate":
               return $scope.ActivityList[Index].itTransDate != null ? $scope.ActivityList[Index].itTransDate : "";
                break;
           case "itUniqueDate":
               return $scope.ActivityList[Index].itUniqueDate != null ? $scope.ActivityList[Index].itUniqueDate : "";
               break;

           case "itUnitDate2":
               return $scope.ActivityList[Index].itUnitDate2 != null ? $scope.ActivityList[Index].itUnitDate2 : "";
               break;

         
           case "itUpdateDate":
               return $scope.ActivityList[Index].itUpdateDate != null ? $scope.ActivityList[Index].itUpdateDate : "";
               break;
           case "itUpdateUser":
               return $scope.ActivityList[Index].itUpdateUser != null ? $scope.ActivityList[Index].itUpdateUser : "";
               break;


           case "itUnitTag2":
               return $scope.ActivityList[Index].itUnitTag2 != null ? $scope.ActivityList[Index].itUnitTag2 : "";
               break;
           case "itUnitTag3":
               return $scope.ActivityList[Index].itUnitTag3 != null ? $scope.ActivityList[Index].itUnitTag3 : "";
               break;
          
               
            case "string_1":
                return $scope.ActivityList[Index].string_1 != null ? $scope.ActivityList[Index].string_1 : "";
                break;
            case "string_2":
                return $scope.ActivityList[Index].string_2 != null ? $scope.ActivityList[Index].string_2 : "";
                break;
            case "string_3":
                return $scope.ActivityList[Index].string_3 != null ? $scope.ActivityList[Index].string_3 : "";
                break;
            case "string_4":
                return $scope.ActivityList[Index].string_4 != null ? $scope.ActivityList[Index].string_4 : "";
                break;
            case "string_5":
                return $scope.ActivityList[Index].string_5 != null ? $scope.ActivityList[Index].string_5 : "";
                break;
            case "string_6":
                return $scope.ActivityList[Index].string_6 != null ? $scope.ActivityList[Index].string_6 : "";
                break;
            case "string_7":
                return $scope.ActivityList[Index].string_7 != null ? $scope.ActivityList[Index].string_7 : "";
                break;
            case "string_8":
                return $scope.ActivityList[Index].string_8 != null ? $scope.ActivityList[Index].string_8 : "";
                break;
            case "string_9":
                return $scope.ActivityList[Index].string_9 != null ? $scope.ActivityList[Index].string_9 : "";
                break;
            case "string_10":
                return $scope.ActivityList[Index].string_10 != null ? $scope.ActivityList[Index].string_10 : "";
                break;

            case "string_11":
                return $scope.ActivityList[Index].string_11 != null ? $scope.ActivityList[Index].string_11 : "";
                break;
            case "string_12":
                return $scope.ActivityList[Index].string_12 != null ? $scope.ActivityList[Index].string_12 : "";
                break;
            case "string_13":
                return $scope.ActivityList[Index].string_13 != null ? $scope.ActivityList[Index].string_13 : "";
                break;
            case "string_14":
                return $scope.ActivityList[Index].string_14 != null ? $scope.ActivityList[Index].string_14 : "";
                break;
            case "string_15":
                return $scope.ActivityList[Index].string_15 != null ? $scope.ActivityList[Index].string_15 : "";
                break;
            case "string_16":
                return $scope.ActivityList[Index].string_16 != null ? $scope.ActivityList[Index].string_16 : "";
                break;
            case "string_17":
                return $scope.ActivityList[Index].string_17 != null ? $scope.ActivityList[Index].string_17 : "";
                break;
            case "string_18":
                return $scope.ActivityList[Index].string_18 != null ? $scope.ActivityList[Index].string_18 : "";
                break;
            case "string_19":
                return $scope.ActivityList[Index].string_19 != null ? $scope.ActivityList[Index].string_19 : "";
                break;
            case "string_20":
                return $scope.ActivityList[Index].string_20 != null ? $scope.ActivityList[Index].string_20 : "";
                break;
            case "string_21":
                return $scope.ActivityList[Index].string_21 != null ? $scope.ActivityList[Index].string_21 : "";
                break;
            case "string_22":
                return $scope.ActivityList[Index].string_22 != null ? $scope.ActivityList[Index].string_22 : "";
                break;
            case "string_23":
                return $scope.ActivityList[Index].string_23 != null ? $scope.ActivityList[Index].string_23 : "";
                break;
            case "string_24":
                return $scope.ActivityList[Index].string_24 != null ? $scope.ActivityList[Index].string_24 : "";
                break;

           case "i_string_1":
               return $scope.ActivityList[Index].i_string_1 != null ? $scope.ActivityList[Index].i_string_1 : "";
               break;
           case "i_string_2":
               return $scope.ActivityList[Index].i_string_2 != null ? $scope.ActivityList[Index].i_string_2 : "";
               break;
           case "i_string_3":
               return $scope.ActivityList[Index].i_string_3 != null ? $scope.ActivityList[Index].i_string_3 : "";
               break;
           case "i_string_4":
               return $scope.ActivityList[Index].i_string_4 != null ? $scope.ActivityList[Index].i_string_4 : "";
               break;
           case "i_string_5":
               return $scope.ActivityList[Index].i_string_5 != null ? $scope.ActivityList[Index].i_string_5 : "";
               break;
           case "i_string_6":
               return $scope.ActivityList[Index].i_string_6 != null ? $scope.ActivityList[Index].i_string_6 : "";
               break;
           case "i_string_7":
               return $scope.ActivityList[Index].i_string_7 != null ? $scope.ActivityList[Index].i_string_7 : "";
               break;
           case "i_string_8":
               return $scope.ActivityList[Index].i_string_8 != null ? $scope.ActivityList[Index].i_string_8 : "";
               break;
           case "i_string_9":
               return $scope.ActivityList[Index].i_string_9 != null ? $scope.ActivityList[Index].i_string_9 : "";
               break;
           case "i_string_10":
               return $scope.ActivityList[Index].i_string_10 != null ? $scope.ActivityList[Index].i_string_10 : "";
               break;

           case "i_string_11":
               return $scope.ActivityList[Index].i_string_11 != null ? $scope.ActivityList[Index].i_string_11 : "";
               break;
           case "i_string_12":
               return $scope.ActivityList[Index].i_string_12 != null ? $scope.ActivityList[Index].i_string_12 : "";
               break;
           case "i_string_13":
               return $scope.ActivityList[Index].i_string_13 != null ? $scope.ActivityList[Index].i_string_13 : "";
               break;
           case "i_string_14":
               return $scope.ActivityList[Index].i_string_14 != null ? $scope.ActivityList[Index].i_string_14 : "";
               break;
           case "i_string_15":
               return $scope.ActivityList[Index].i_string_15 != null ? $scope.ActivityList[Index].i_string_15 : "";
               break;
           case "i_string_16":
               return $scope.ActivityList[Index].i_string_16 != null ? $scope.ActivityList[Index].i_string_16 : "";
               break;
           case "i_string_17":
               return $scope.ActivityList[Index].i_string_17 != null ? $scope.ActivityList[Index].i_string_17 : "";
               break;
           case "i_string_18":
               return $scope.ActivityList[Index].i_string_18 != null ? $scope.ActivityList[Index].i_string_18 : "";
               break;
           case "i_string_19":
               return $scope.ActivityList[Index].i_string_19 != null ? $scope.ActivityList[Index].i_string_19 : "";
               break;
           case "i_string_20":
               return $scope.ActivityList[Index].i_string_20 != null ? $scope.ActivityList[Index].i_string_20 : "";
               break;
           case "i_string_21":
               return $scope.ActivityList[Index].i_string_21 != null ? $scope.ActivityList[Index].i_string_21 : "";
               break;
           case "i_string_22":
               return $scope.ActivityList[Index].i_string_22 != null ? $scope.ActivityList[Index].i_string_22 : "";
               break;
           case "i_string_23":
               return $scope.ActivityList[Index].i_string_23 != null ? $scope.ActivityList[Index].i_string_23 : "";
               break;
           case "i_string_24":
               return $scope.ActivityList[Index].i_string_24 != null ? $scope.ActivityList[Index].i_string_24 : "";
               break;




            case "number_1":
                return $scope.ActivityList[Index].number_1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_1) : "";
                break;
            case "number_2":
                return $scope.ActivityList[Index].number_2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_2) : "";
                break;
            case "number_3":
                return $scope.ActivityList[Index].number_3 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_3) : "";
                break;
            case "number_4":
                return $scope.ActivityList[Index].number_4 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_4) : "";
                break;
            case "number_5":
                return $scope.ActivityList[Index].number_5 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_5) : "";
                break;
            case "number_6":
                return $scope.ActivityList[Index].number_6 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_6) : "";
                break;
            case "number_7":
                return $scope.ActivityList[Index].number_7 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_7) : "";
                break;
            case "number_8":
                return $scope.ActivityList[Index].number_8 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_8) : "";
                break;
            case "number_9":
                return $scope.ActivityList[Index].number_9 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_9) : "";
                break;
            case "number_10":
                return $scope.ActivityList[Index].number_10 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_10) : "";
                break;

            case "number_11":
                return $scope.ActivityList[Index].number_11 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_11) : "";
                break;
            case "number_12":
                return $scope.ActivityList[Index].number_12 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].number_12) : "";
                break;



           case "i_number_1":
               return $scope.ActivityList[Index].i_number_1 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_1) : "";
               break;
           case "i_number_2":
               return $scope.ActivityList[Index].i_number_2 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_2) : "";
               break;
           case "i_number_3":
               return $scope.ActivityList[Index].i_number_3 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_3) : "";
               break;
           case "i_number_4":
               return $scope.ActivityList[Index].i_number_4 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_4) : "";
               break;
           case "i_number_5":
               return $scope.ActivityList[Index].i_number_5 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_5) : "";
               break;
           case "i_number_6":
               return $scope.ActivityList[Index].i_number_6 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_6) : "";
               break;
           case "i_number_7":
               return $scope.ActivityList[Index].i_number_7 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_7) : "";
               break;
           case "i_number_8":
               return $scope.ActivityList[Index].i_number_8 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_8) : "";
               break;
           case "i_number_9":
               return $scope.ActivityList[Index].i_number_9 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_9) : "";
               break;
           case "i_number_10":
               return $scope.ActivityList[Index].i_number_10 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_10) : "";
               break;

           case "i_number_11":
               return $scope.ActivityList[Index].i_number_11 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_11) : "";
               break;
           case "i_number_12":
               return $scope.ActivityList[Index].i_number_12 != null ? ChangeIntoNumberFormat($scope.InventoryList[Index].i_number_12) : "";
               break;

            case "bool_1":
                return $scope.ActivityList[Index].bool_1 != null ? $scope.ActivityList[Index].bool_1 : "";
                break;
            case "bool_2":
                return $scope.ActivityList[Index].bool_2 != null ? $scope.ActivityList[Index].bool_2 : "";
                break;
            case "bool_3":
                return $scope.ActivityList[Index].bool_3 != null ? $scope.ActivityList[Index].bool_3 : "";
                break;
            case "bool_4":
                return $scope.ActivityList[Index].bool_4 != null ? $scope.ActivityList[Index].bool_4 : "";
                break;
            case "bool_5":
                return $scope.ActivityList[Index].bool_5 != null ? $scope.ActivityList[Index].bool_5 : "";
                break;
            case "bool_6":
                return $scope.ActivityList[Index].bool_6 != null ? $scope.ActivityList[Index].bool_6 : "";
                break;




           case "i_bool_1":
               return $scope.ActivityList[Index].i_bool_1 != null ? $scope.ActivityList[Index].i_bool_1 : "";
               break;
           case "i_bool_2":
               return $scope.ActivityList[Index].i_bool_2 != null ? $scope.ActivityList[Index].i_bool_2 : "";
               break;
           case "i_bool_3":
               return $scope.ActivityList[Index].i_bool_3 != null ? $scope.ActivityList[Index].i_bool_3 : "";
               break;
           case "i_bool_4":
               return $scope.ActivityList[Index].i_bool_4 != null ? $scope.ActivityList[Index].i_bool_4 : "";
               break;
           case "i_bool_5":
               return $scope.ActivityList[Index].i_bool_5 != null ? $scope.ActivityList[Index].i_bool_5 : "";
               break;
           case "i_bool_6":
               return $scope.ActivityList[Index].i_bool_6 != null ? $scope.ActivityList[Index].i_bool_6 : "";
               break;

           case "i_date_1":
               return $scope.ActivityList[Index].i_date_1 != null ? $scope.ActivityList[Index].i_date_1 : "";
               break;

           case "i_date_2":
               return $scope.ActivityList[Index].i_date_2 != null ? $scope.ActivityList[Index].i_date_2 : "";
               break;
           case "i_date_3":
               return $scope.ActivityList[Index].i_date_3 != null ? $scope.ActivityList[Index].i_date_3 : "";
               break;
           case "i_date_4":
               return $scope.ActivityList[Index].i_date_4 != null ? $scope.ActivityList[Index].i_date_4 : "";
               break;
           case "i_date_5":
               return $scope.ActivityList[Index].i_date_5 != null ? $scope.ActivityList[Index].i_date_5 : "";
               break;
           case "i_date_6":
               return $scope.ActivityList[Index].i_date_6 != null ? $scope.ActivityList[Index].i_date_6 : "";
               break;


            case "date_1":
                return $scope.ActivityList[Index].date_1 != null ? $scope.ActivityList[Index].date_1 : "";
                break;

            case "date_2":
                return $scope.ActivityList[Index].date_2 != null ? $scope.ActivityList[Index].date_2 : "";
                break;
            case "date_3":
                return $scope.ActivityList[Index].date_3 != null ? $scope.ActivityList[Index].date_3 : "";
                break;
            case "date_4":
                return $scope.ActivityList[Index].date_4 != null ? $scope.ActivityList[Index].date_4 : "";
                break;
            case "date_5":
                return $scope.ActivityList[Index].date_5 != null ? $scope.ActivityList[Index].date_5 : "";
                break;
            case "date_6":
                return $scope.ActivityList[Index].date_6 != null ? $scope.ActivityList[Index].date_6 : "";
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
    $scope.GetActivityViews = function () {
        $scope.isDataLoading = false;
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetAllViews',
              data: JSON.stringify({ SecurityToken: $scope.SecurityToken, Type: 3 }),
              contentType: 'application/json',
              dataType: 'json',
              success: function (response)
              {
                  $scope.isDataLoading = true;
              $scope.ActivityViews = response.GetAllViewsResult.Payload;
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
        $scope.CurrentView = { Name: "Inventory Activity" };
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
        $scope.GetActivityDataAccordingToView();
    }
    $scope.showfilter = function () {
        $("#filtermodal").modal("show")
    }

    $scope.GetActivityDataAccordingToView=function()
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

            
            var _searchParameter= $scope.CurrentView.SearchValue + $scope.FilterData.SearchValue;
            $.ajax
              ({
                  type: "POST",
                  url: serviceBase + 'GetInventoryActivities',
                  data: JSON.stringify({ SecurityToken: $scope.SecurityToken, pageToReturn: 1, sortCol: _sortColumn, sortDir: _sortDir, filterArray: $scope.FilterArray, masterSearch: _searchParameter, PageSize: _PageSize, ViewID: $scope.CurrentView.GridLayoutID }),
                  contentType: 'application/json',
                  dataType: 'json',
                  success: function (response) {
                      $scope.isDataLoading = true;
                      $scope.isviewload = true;

                      debugger;
                      
                      _TotalRecordsCurrent = response.GetInventoryActivitiesResult.Payload[0].Data.length;
                      $scope.currentrecord = response.GetInventoryActivitiesResult.Payload[0].Data.length;
                      $scope.ActivityList = response.GetInventoryActivitiesResult.Payload[0].Data;
                      $scope.totalrecords = response.GetInventoryActivitiesResult.Payload[0].TotalRercords;
                      $scope.Columns = response.GetInventoryActivitiesResult.Payload[0].Columns;
                      $scope.ActualTotalRecords = response.GetInventoryActivitiesResult.Payload[0].ActualTotalRecords;
                      $scope.FilterArray = response.GetInventoryActivitiesResult.Payload[0].Filters;
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
            $scope.sortDir = _sortDir;

        }
        $scope.sortColumn = sortby;
        CheckScopeBeforeApply();
        $scope.GetActivityDataAccordingToView()

    }

    function init() {
        $scope.getuom();
        $scope.getstatus();
        $scope.GetActivityViews();
        $scope.GetCustomDataField(0);
        $scope.GetCustomDataField(1);
        CheckScopeBeforeApply();
      
    
    }

    init();
}]);