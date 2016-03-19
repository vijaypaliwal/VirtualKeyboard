'use strict';
app.controller('activityController', ['$scope', 'ordersService', 'localStorageService', 'authService', '$location', 'log', function ($scope, ordersService, localStorageService, authService, $location, log) {
    $scope.CurrentCart = [];
    $scope.SavingData = false;
    $scope.IsEditMode = false;
    $scope.CustomActivityDataList = [];
    $scope.CurrentOperation = "";
    $scope.AllowNegative = false;
    $scope.CanCost = true;
    $scope._IsLoading = true;
    $scope.totalLength = 0;
    $scope.MyinventoryFields = [];
    $scope.IsSummary = false;
    $scope.CurrentStep = 0;
    $scope.IsProcessing = false;
    var _AllowNegative = 'False';
    $scope.IssueType = 0;
    $scope.isLineItemColumnNames = [];
    function CheckScopeBeforeApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    var mySwiper;

    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    $scope.OpenmenuModal = function () {

        if ($("body").hasClass("modal-open")) {
            $("#myModal2").modal('hide');
        }
        else {
            $("#myModal2").modal('show');
        }
    }

    $scope.CancelEdit = function () {
        $scope.IsEditMode = false;

        $scope.$apply();

    }



    $scope.OpenSummary = function () {

        $scope.IsSummary = true;
        CheckScopeBeforeApply();
    }

    $scope.CloseSummary = function () {

        $scope.IsSummary = false;
        CheckScopeBeforeApply();
    }

    $scope.FillQuantity = function (value, id, type) {
        $scope.ActionQuantityValue = value;

        var k = 0;
        switch (type) {
            case 1:
                if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValue;
                    }

                    //   $("#mybutton_" + id).removeClass("rotateData")

                    toastr.success("Data updated successfully.");
                    //  $scope.NextClickNew(2);
                    //  $scope.CurrentActiveObject = $scope.CurrentCart[0];
                    CheckScopeBeforeApply();;
                }
                else {
                    toastr.error("Please input some valid value");
                }
                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentCart[k].InventoryDataList.oquantity > 0) {

                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    else {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = 0;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = 0;
                    }
                }

                //    $("#mybutton_" + id).removeClass("rotateData")

                toastr.success("Data updated successfully.");
                CheckScopeBeforeApply();;

                break;

            default:

        }

    };

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
                   CheckScopeBeforeApply()
               },
               error: function (err) {


                   log.error(err.Message);

               }
           });

    }


    $scope.locationlist = function (inventoryid, locationid) {




        $scope.currentinventoryid = inventoryid

        $scope.currentlocationid = locationid


        $("#locationlistmodal").modal('show');
        $scope.LocationSearchList = [];
        $scope.SearchLocationValue = "";
        $scope.isnolocationmsg = false

    }

    $scope.OnChangeLocationNameFunction = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        $scope.LocationSearching = true;
        $.ajax({

            type: "POST",
            url: serviceBase + "SearchLocationAutoComplete",
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',

            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, SearchValue: $scope.SearchLocationValue }),
            error: function () {

                $scope.LocationSearching = false;
                log.error('There is a problem with the service!');
            },

            success: function (data) {



                if (data.SearchLocationAutoCompleteResult != null && data.SearchLocationAutoCompleteResult.Payload != null) {
                    $scope.LocationSearching = false;
                    $scope.LocationSearchList = data.SearchLocationAutoCompleteResult.Payload;


                    if ($scope.LocationSearchList.length == 0)
                        $scope.isnolocationmsg = true
                    else
                        $scope.isnolocationmsg = false

                    CheckScopeBeforeApply()

                }



            }
        });
    }


    $scope.HighLightTerm = function (term, Text) {

        var src_str = Text;
        var term = term;
        term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
        var pattern = new RegExp("(" + term + ")", "gi");

        src_str = src_str.replace(pattern, "<mark>$1</mark>");
        src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

        return src_str;
    }

    $scope.LocationSetItemData = function (obj) {



        var k = 0;

        for (k = 0; k < $scope.CurrentCart.length; k++) {
            if ($scope.CurrentCart[k].InventoryDataList.uId == $scope.currentinventoryid) {

                if ($scope.CurrentCart[k].InventoryDataList.iLID !== obj.LocationID) {

                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = obj.LocationName;
                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = obj.LocationID;
                    break;
                }
                else {
                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = "";
                    $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = "";
                    log.error("Please select other location, you can't move item to same location.")
                    break;
                }
            }

        }


        CheckScopeBeforeApply();;




        $("#locationlistmodal").modal('hide');
        CheckScopeBeforeApply()
    }



    $scope.GetMyInventoryColumns = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {


                  // MY inventory column region
                  var _TempArrayMyInventory = response.GetMyInventoryColumnsResult.Payload;

                  for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                      var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                      _TempArrayMyInventory[i].ColumnName = _ColName[0];
                      if (_TempArrayMyInventory[i].Show == "True") {
                          $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                      }
                  }
                  CheckScopeBeforeApply()


              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });
    }
    $scope.Scanitem = function () {



        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pPart = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    $scope.Scandescription = function () {



        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.CurrentInventory.pDescription = result.text;

            $scope.$apply();


        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

    init();

    function UpdateCartWithCustomFields() {
        var k = 0;
        var j = 0;
        var _TempArray = [];
        for (k = 0; k < $scope.CustomActivityDataList.length; k++) {
            if ($scope.CustomActivityDataList[k].cfdCustomFieldType == "Inventory" && $scope.CustomActivityDataList[k].isLineItem == "True") {
                _TempArray.push($scope.CustomActivityDataList[k]);
                $scope.isLineItemColumnNames.push($scope.CustomActivityDataList[k].cfdName)
            }


        }
        if ($scope.CurrentCart.length > 0) {
            var i = 0;
            for (i = 0; i < $scope.CurrentCart.length; i++) {

                for (j = 0; j < _TempArray.length; j++) {
                    $scope.CurrentCart[i].IsLineItemData.push({
                        cfdIsRequired: _TempArray[j].cfdIsRequired, cfdName: _TempArray[j].cfdName,
                        cfdID: _TempArray[j].cfdID,
                        InventoryID: $scope.CurrentCart[i].InventoryID,
                        cfdCustomFieldType: _TempArray[j].cfdCustomFieldType,
                        ColumnMap: _TempArray[j].ColumnMap,
                        cfdDataType: _TempArray[j].cfdDataType,
                        CfValue: _TempArray[j].cfdDefaultValue != null && $.trim(_TempArray[j].cfdDefaultValue) != "" ? _TempArray[j].cfdDefaultValue : "",
                        cfdComboValues: _TempArray[j].cfdComboValues == null ? [] : _TempArray[j].cfdComboValues
                    });
                }

            }
        }

        CheckScopeBeforeApply();

        AssignFirstObject();
    }

    function GetMyInventoryColumns() {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }
        $.ajax
          ({
              type: "POST",
              url: serviceBase + 'GetMyInventoryColumns',
              contentType: 'application/json; charset=utf-8',

              dataType: 'json',
              data: JSON.stringify({ "SecurityToken": $scope.SecurityToken }),
              success: function (response) {


                  // MY inventory column region
                  var _TempArrayMyInventory = response.GetMyInventoryColumnsResult.Payload;

                  for (var i = 0; i < _TempArrayMyInventory.length; i++) {
                      var _ColName = _TempArrayMyInventory[i].ColumnName.split("#");
                      _TempArrayMyInventory[i].ColumnName = _ColName[0];
                      if (_TempArrayMyInventory[i].Show == "True") {
                          $scope.MyinventoryFields.push(_TempArrayMyInventory[i]);
                      }
                  }
                  CheckScopeBeforeApply()


              },
              error: function (err) {
                  console.log(err);
                  log.error("Error Occurred during operation");


              }
          });
    }

    function AssignFirstObject() {
        if ($scope.CurrentCart.length > 0) {
            $scope._IsLoading = false;

            setTimeout(function () {
                InitializeSwiper();

            }, 0);
        }
        CheckScopeBeforeApply();
    }
    function GetCustomDataField(Type) {
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

                   $scope.CustomActivityDataList = response.GetCustomFieldsDataResult.Payload;



                   CheckScopeBeforeApply();
                   UpdateCartWithCustomFields();
                   CheckScopeBeforeApply();
               },
               error: function (response) {

                   log.error(response.GetCustomFieldsDataResult.Errors[0]);
               }
           });
    }



    $scope.IsActiveTransactionField = function (cfdid) {


        for (var i = 0; i < $scope.CustomActivityDataList.length; i++) {
            if ($scope.CustomActivityDataList[i].cfdCustomFieldType == "Inventory" && $scope.CustomActivityDataList[i].cfdID == cfdid) {
                switch ($scope.CurrentOperation) {
                    case "Increase":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnAdd) {

                            return true;
                        }
                        break;
                    case "Decrease":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnSubtract) {
                            return true;
                        }
                        break;
                    case "Move":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnMove) {
                            return true;
                        }
                        break;
                    case "Apply":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnApply) {
                            return true;
                        }
                        break;
                    case "Update":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnStatus) {
                            return true;
                        }
                        break;
                    case "Convert":
                        if ($scope.CustomActivityDataList[i].cfdIncludeOnConvert) {
                            return true;
                        }
                        break;

                    default:
                        return true;
                        break;

                }
            }
        }
    }

    function init() {
        $scope.CurrentCart = localStorageService.get("ActivityCart");
        var _CurrentAction = localStorageService.get("SelectedAction");
        _CurrentAction = _CurrentAction != null && _CurrentAction != undefined ? parseInt(_CurrentAction) : 4548;

        $scope._CurrentAction = _CurrentAction;
        GetActionType(_CurrentAction);
        $scope.totalLength = $scope.CurrentCart.length + 2;
        GetCustomDataField(1);

        $scope.getstatus()
        GetMyInventoryColumns();
        CheckScopeBeforeApply();

    }


    function GetActionType(Action) {
        switch (Action) {
            case -1:
                $scope.CurrentClass = "bgm-decrease";
                $scope.CurrentHeaderClass = "bgm-decrease";
                $scope.CurrentOperation = "Decrease";
                $scope.CurrentIcon = "fa-arrow-down";
                $scope.CurrentHeaderText = "Take these items out of inventory.";
               // StatusBar.backgroundColorByHexString("#AF2525");

                break;
            case 0:
                $scope.CurrentClass = "bgm-move";
                $scope.CurrentHeaderClass = "bgm-move";
                $scope.CurrentOperation = "Move";
                $scope.CurrentIcon = "fa-arrow-right";
                $scope.CurrentHeaderText = "Move these items to a different location.";
               // StatusBar.backgroundColorByHexString("#C65E28");
                break;
            case 1:
                $scope.CurrentClass = "bgm-increase"
                $scope.CurrentHeaderClass = "bgm-increase";
                $scope.CurrentOperation = "Increase";
                $scope.CurrentIcon = "fa-arrow-up";
                $scope.CurrentHeaderText = "Put these items in inventory.";
               // StatusBar.backgroundColorByHexString("#177B3D");
                break;
            case 2:
                $scope.CurrentClass = "bgm-convert"
                $scope.CurrentHeaderClass = "bgm-convert";
                $scope.CurrentOperation = "Convert";
                $scope.CurrentIcon = "fa-sitemap";
                $scope.CurrentHeaderText = "Convert the units of measure for these items.";


                break;
            case 3:
                $scope.CurrentClass = "bgm-purple"
                $scope.CurrentHeaderClass = "bgm-purple";
                $scope.CurrentOperation = "Update";
                $scope.CurrentIcon = "fa-history fa-flip-horizontal";
                $scope.CurrentHeaderText = "Update the status of these items.";
                break;
            case 4:
                $scope.CurrentClass = "bgm-apply"
                $scope.CurrentHeaderClass = "bgm-apply";
                $scope.CurrentOperation = "Apply";
                $scope.CurrentIcon = "fa-tag";
                $scope.CurrentHeaderText = "Tag these items with information.";
              //  StatusBar.backgroundColorByHexString("#0D190F");
                break;
            default:
                $scope.CurrentOperation = "";
                break;


        }

        CheckScopeBeforeApply();
    }


    function InitializeSwiper() {

        mySwiper = new Swiper('.swiper-container', {
            //Your options here:
            initialSlide: 0,
            speed: 500,
            effect: 'flip',

            allowSwipeToPrev: false,


            onSlideChangeEnd: function (swiperHere) {

                $scope.CurrentStep = swiperHere.activeIndex;
                CheckScopeBeforeApply();

                $scope.changeNav();


            }




        });
    }

    function GetTypeByIndex() {
        var _type = "";
        $(".swiper-slide").each(function () {

            if ($(this).hasClass("swiper-slide-active")) {
                _type = $(this).attr("data-type") != null && $(this).attr("data-type") != undefined ? $(this).attr("data-type") : "";

                console.log(_type);
            }

        });

        return _type;

    }


    $scope.GoToStep = function (Index, _step) {
        var type = GetTypeByIndex();


        _step = _step == null || _step == undefined ? 1 : _step;
        switch (_step) {
            case 1:
                if (!$scope.ValidateObjectVMStop(Index, type)) {

                    $(".swiper-slide").each(function () {

                        if ($(this).attr("data-index") == Index) {
                            mySwiper.swipeTo($(this).index(), 1000, false);



                            $scope.CurrentStep = Index;
                            CheckScopeBeforeApply();

                            return false;
                        }

                    });
                }
                else {
                    $scope.ShowErrorMessage($scope.IssueType)
                }
                break;
            case 2:
                $(".swiper-slide").each(function () {

                    if ($(this).attr("data-index") == Index) {
                        mySwiper.swipeTo($(this).index(), 1000, false);


                        $scope.CurrentStep = Index;
                        CheckScopeBeforeApply();

                        return false;
                    }

                });
                break;
            default:

                if (!$scope.ValidateObjectVMStop(Index, type)) {

                    $(".swiper-slide").each(function () {

                        if ($(this).attr("data-index") == Index) {
                            mySwiper.swipeTo($(this).index(), 1000, false);


                            $scope.CurrentStep = Index;
                            CheckScopeBeforeApply();

                            return false;
                        }

                    });
                }
                else {
                    $scope.ShowErrorMessage($scope.IssueType)
                }

                break;

        }



    }




    function BuildCustomArrayData() {
        var _array = [];

        // process all custom fields that are NOT checkboxes
        $.each($('.customActivityData input[cfd-id]:not(":checkbox"):not(":hidden"), select[cfd-id]:not(":hidden"), textarea[cfd-id]:not(":hidden")'), function () {


            _array.push({ "CfdID": $(this).attr('cfd-id'), "Value": $(this).val(), "DataType": $(this).attr('custom-data-type') });
        });

        // process the checkboxes by getting the Boolean string for whether they are currently checked
        $.each($('.customActivityData input:checkbox[cfd-id]:not(":hidden")'), function () {
            var _dataVal = $(this).is(':checked').toString();
            _dataVal = _dataVal.substr(0, 1).toUpperCase() + _dataVal.substr(1).toLowerCase();

            _array.push({ "CfdID": $(this).attr('cfd-id'), "Value": _dataVal, "DataType": $(this).attr('custom-data-type') });
        });
        return _array;
    }



    $scope.FillQuantity = function (value, id, type) {
        $scope.ActionQuantityValue = value;

        var k = 0;
        switch (type) {
            case 1:
                if ($scope.ActionQuantityValue != "" && $scope.ActionQuantityValue != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.ActionQuantityValue;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValue;
                    }

                    $("#mybutton_" + id).addClass("movepin")

                    log.success("Data updated successfully.");
                    //  $scope.NextClickNew(2);
                    //  $scope.CurrentActiveObject = $scope.CurrentCart[0];
                    CheckScopeBeforeApply();;
                }
                else {
                    log.error("Please input some valid value");
                }
                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {

                    if ($scope.CurrentCart[k].InventoryDataList.oquantity > 0) {

                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                    }
                    else {
                        $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity = 0;
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = 0;
                    }
                }

                $("#mybutton_" + id).addClass("movepin")

                log.success("Data updated successfully.");
                CheckScopeBeforeApply();;

                break;

            default:

        }

    };


    $scope.FillQuantityMove = function (value, id, type) {


        var k = 0;

        $scope.ActionQuantityValueMove = value;



        switch (type) {
            case 1:
                if ($scope.ActionQuantityValueMove != "" && $scope.ActionQuantityValueMove != undefined) {

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.ActionQuantityValueMove;

                    }
                    $("#movebutton_" + id).addClass("movepin")
                    log.success("Data updated successfully.");
                    CheckScopeBeforeApply();;

                }
                else {
                    toastr.error("Please input some valid value");
                }

                break;
            case 2:

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].MoveTransactionData.ActionQuantity = $scope.CurrentCart[k].InventoryDataList.oquantity;
                }

                $("#movebutton_" + id).addClass("movepin")
                CheckScopeBeforeApply();;
                toastr.success("Data updated successfully.");

                break;

            default:

        }





    };


    $scope.FillLocation = function (value, text, id) {


        $scope.ToLocID = value;
        if ($scope.ToLocID != 0) {
            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {
                $scope.CurrentCart[k].MoveTransactionData.MoveToLocation = $scope.ToLocID;
                $scope.CurrentCart[k].MoveTransactionData.MoveToLocationText = text;
            }


            CheckScopeBeforeApply();;


            $("#location_" + id).addClass("movepin")
            log.success("Data updated successfully.");
        }

        else {
            log.error("Please select some value.");
        }
    }


    $scope.FillStatusLineItems2 = function (value, id) {

        $scope.StatusToUpdateLoc = value == null ? "" : value;
        $scope.StatusToUpdateLoc = $scope.StatusToUpdateLoc == 0 ? "" : $scope.StatusToUpdateLoc;

        var k = 0;
        for (k = 0; k < $scope.CurrentCart.length; k++) {
            $scope.CurrentCart[k].MoveTransactionData.StatusToUpdate = $scope.StatusToUpdateLoc;

        }
        CheckScopeBeforeApply();;

        $scope.CurrentLineItemIndex = -1;
        $scope.CurrentInventoryId = -1;

        $("#LineItems2_" + id).addClass("movepin")

        toastr.success("Data updated successfully.");

    }

    $scope.FillUnitData = function (FieldName, value, myid) {
        var k = 0;
        value = value == null || value == undefined ? "" : value;
        switch (FieldName) {
            case "iReqValue":
                $scope.UnitDataTag1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitTag1 = $scope.UnitDataTag1;

                }
                $("#unittag1_" + myid).addClass("movepin")

                break;
            case "iUnitTag2":
                $scope.UnitDataTag2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitTag2 = $scope.UnitDataTag2;

                }
                $("#unittag2_" + myid).addClass("movepin")


                break;
            case "iUnitTag3":
                $scope.UnitDataTag3 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitTag3 = $scope.UnitDataTag3;

                }
                $("#unittag3_" + myid).addClass("movepin")


                break;
            case "iUnitNumber1":
                $scope.UnitDataNumber1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 = $scope.UnitDataNumber1;

                }
                $("#unitnumber1_" + myid).addClass("movepin")

                break;
            case "iUnitNumber2":
                $scope.UnitDataNumber2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 = $scope.UnitDataNumber2;

                }
                $("#unitnumber2_" + myid).addClass("movepin")

                break;
            case "iUnitDate2":
                $scope.UnitDataDate2 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 = $scope.UnitDataDate2;

                }

                $("#unitdate2_" + myid).addClass("movepin")

                break;
            case "iUniqueDate":
                $scope.UnitDataDate1 = value;

                for (k = 0; k < $scope.CurrentCart.length; k++) {
                    $scope.CurrentCart[k].ApplyTransactionData.UniqueDate = $scope.UnitDataDate1;

                }
                $("#unitdate_" + myid).addClass("movepin")

                break;
            default:

        }

        log.success("Data updated success fully");

    }

    $scope.GetColumnLabel = function (ColumnID) {
        var j = 0;

        var ColumnLabel = ColumnID;
        for (j = 0; j < $scope.MyinventoryFields.length; j++) {
            if ($scope.MyinventoryFields[j].ColumnName == ColumnID) {
                ColumnLabel = $scope.MyinventoryFields[j].ColumnLabel
                break;
            }

        }
        return ColumnLabel;

    }

    Date.prototype.toMSJSON = function () {
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };

    function BuildMultipleData() {
        var dt = new Date();
        var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
        var wcfDateStr = dt1.toMSJSON();
        var wcfDateStr123 = dt1.toMSJSON();

        var _updateDateval = $("#itUpdateDate").val();


        var dsplit1 = _updateDateval.split("-");

        var d122 = new Date(dsplit1[0], dsplit1[1] - 1, dsplit1[2]);

        var d112 = new Date(Date.UTC(d122.getFullYear(), d122.getMonth(), d122.getDate(), d122.getHours(), d122.getMinutes(), d122.getSeconds(), d122.getMilliseconds()))

        wcfDateStr123 = d122.toMSJSON();






        var wcfDateStr1 = null;
        var wcfDateStr2 = null;

        var k = 0;
        var _myData = [];
        var _MyObjdata = {
            InvID: 0,
            Transaction: {
                itAID: 0,
                itAction: $scope._CurrentAction,
                itBatchID: 0,
                itCostPerUnit: 0,
                itID: 0,
                itInvID: 0,
                itLID: 0,
                itPID: 0,
                itParentTransID: 0,
                itQtyChange: 0,
                itReqValue: "",
                itSourceID: 1,
                itStatusValue: "",
                itUpdateDate: wcfDateStr123,
                itUOMID: 0,
                itUncontrolled: 0,
                itUniqueDate: wcfDateStr,
                itUnitDate2: wcfDateStr,
                itUnitNumber1: 0,
                itUnitNumber2: 0,
                itUnitTag2: "",
                itUnitTag3: ""
            },
            Targets: {
                ToLocationID: 0,
                ToUomID: 0,
                ToConvertedQuantity: 0,
                ToStatus: ""
            },
            CustomData: BuildCustomArrayData()
        };

        for (k = 0; k < $scope.CurrentCart.length; k++) {
            var _TempQty = $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity;
            var _TempStatus = $scope.CurrentCart[k].InventoryDataList.iStatusValue;
            var _TempLocID = $scope.CurrentCart[k].InventoryDataList.iLID;
            if ($scope.CurrentOperation == "Convert") {
                _TempQty = $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity;
            }

            if ($scope.CurrentOperation == "Move") {

                _TempQty = $scope.CurrentCart[k].MoveTransactionData.ActionQuantity;
                _TempStatus = $scope.CurrentCart[k].MoveTransactionData.StatusToUpdate;
                _TempLocID = $scope.CurrentCart[k].MoveTransactionData.MoveToLocation;

            }

            if ($scope.CurrentCart[k].ApplyTransactionData.UniqueDate != undefined && $scope.CurrentCart[k].ApplyTransactionData.UniqueDate != "") {

                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UniqueDate;
                var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");

                var d1 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[1] - 1, dsplit[0]);

                var d11 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds(), d1.getMilliseconds()))

                wcfDateStr1 = d11.toMSJSON();
            }
            if ($scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != undefined && $scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != "") {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UnitDate2;
                var dsplit = dateVar.indexOf("/") == -1 ? dateVar.split("-") : dateVar.split("/");


                var d2 = dateVar.indexOf("/") == -1 ? new Date(dsplit[0], dsplit[1] - 1, dsplit[2]) : new Date(dsplit[2], dsplit[1] - 1, dsplit[0]);

                var d21 = new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds(), d2.getMilliseconds()))

                wcfDateStr2 = d21.toMSJSON();

            }

            _myData.push({
                CostPerItem: $scope.CurrentCart[k].iCostPerItem == undefined ? 0 : $scope.CurrentCart[k].iCostPerItem,
                ToStatusValue: _TempStatus,
                iQty: _TempQty == "" ? 0 : _TempQty,
                ToUOMID: $scope.CurrentCart[k].ConvertTransactionData.ToUOMID,
                InvID: $scope.CurrentCart[k].InventoryDataList.uId,
                ToConvertedQty: $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" ? 0 : $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity,
                UOMID: $scope.CurrentCart[k].InventoryDataList.iUOMID,
                LocationID: _TempLocID == "" ? 0 : _TempLocID,
                pID: $scope.CurrentCart[k].InventoryDataList.pID,
                iStatusValue: $scope.CurrentCart[k].UpdateTransactionData.StatusToUpdate,
                UnitTag1: $scope.CurrentCart[k].ApplyTransactionData.UnitTag1,
                UnitTag2: $scope.CurrentCart[k].ApplyTransactionData.UnitTag2,
                UnitTag3: $scope.CurrentCart[k].ApplyTransactionData.UnitTag3,
                UniqueDate: wcfDateStr1,
                UnitDate2: wcfDateStr2,
                UnitNumber1: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1 == undefined ? 0 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber1,
                UnitNumber2: $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2 == undefined ? 0 : $scope.CurrentCart[k].ApplyTransactionData.UnitNumber2,
                myPostObj: _MyObjdata, IsLineItem: $scope.CurrentCart[k].IsLineItemData
            });
        }
        return _myData;

    }

    $scope.keepcart = function () {
        $location.path("/FindItems");
    }


    $scope.cancel = function () {

        var box = bootbox.confirm("You want to cancel this process ?", function (result) {
            if (result) {


                $scope.CurrentCart = [];
                localStorageService.set("ActivityCart", "");
                $location.path("/FindItems");
                CheckScopeBeforeApply();

            }

        });




    }

    $scope.IsMyInventoryColumns = function (ColumnID) {

        var j = 0;
        for (j = 0; j < $scope.MyinventoryFields.length; j++) {
            if ($scope.MyinventoryFields[j].ColumnName == ColumnID) {
                return true;
                break;
            }

        }
        return false;
    }
    $scope.SubmitAllActivities = function () {
        debugger;
        var _dateVal = $("#itUpdateDate").val();
        if (_dateVal != null && _dateVal != undefined) {
            _dateVal = $.trim(_dateVal);
        }
        if (!$scope.ValidateObjectVM()) {

            if (!CheckintoCustomData(0) && _dateVal != "") {

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    $scope.SecurityToken = authData.token;
                }
                $scope.IsProcessing = true;

                var _mdata = BuildMultipleData();

                console.log(_mdata);

                $.ajax({
                    type: "POST",
                    url: serviceBase + 'MultipleActivity',
                    contentType: 'application/json; charset=utf-8',

                    dataType: 'json',
                    data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _mdata }),
                    success: function (response) {


                        $scope.IsProcessing = false;
                        $scope.CurrentCart = [];
                        log.success("Activity performed successfully please, you are redirecting to inventory page.")

                        $location.path("/FindItems");

                        localStorageService.set("ActivityCart", "");
                        localStorageService.set("SelectedAction", "");

                        $scope.$apply();
                        console.log(response);
                    },
                    error: function (err) {
                        debugger;
                        log.error("Some error occurred");
                        console.log(err.responseText);

                    }
                });
            }
            else {
                $scope.GoToStep($scope.CurrentCart.length, 1);
                $scope.ShowErrorMessage($scope.IssueType);
            }
        }

        else {
            $scope.ShowErrorMessage($scope.IssueType);
        }



    }



    $scope.GetObjIndex = function (CurrentActiveObject) {


        for (var i = 0; i < $scope.CurrentCart.length; i++) {
            if ($scope.CurrentCart[i].InventoryID == CurrentActiveObject.InventoryID) {
                return i + 1;
            }
        }
    }


    $scope.DeleteItem = function (CurrentActiveObject) {



        var box = bootbox.confirm("Do you want to proceed ?", function (result) {
            if (result) {
                var _tempArray = $scope.CurrentCart;
                for (var i = 0; i < _tempArray.length; i++) {
                    if (_tempArray[i].InventoryID == CurrentActiveObject.InventoryID) {
                        $scope.CurrentCart.splice(i, 1);
                    }
                }

                localStorageService.set("ActivityCart", "")
                localStorageService.set("ActivityCart", $scope.CurrentCart);
                CheckScopeBeforeApply();
                log.success("Item remove successfully from cart.")

                if ($scope.CurrentCart.length == 0) {
                    log.warning("Seems like you don't have any item in your cart.")
                    $location.path("/FindItems");
                    CheckScopeBeforeApply();

                }


            }
            else {



            }
        });

        box.on("shown.bs.modal", function () {
            $(".mybootboxbody").html("Press ok to delete item to your cart list ");

        });
    }



    $scope.FillLineItem = function (LineItemIndex, fieldID, value, InventoryID) {

        $scope.ActionLineItemData = value;
        if ($scope.ActionLineItemData != "") {
            var k = 0;
            for (k = 0; k < $scope.CurrentCart.length; k++) {
                $scope.CurrentCart[k].IsLineItemData[LineItemIndex].CfValue = $scope.ActionLineItemData;

            }

            var _idtoPass = "#lineitem_" + fieldID.toString() + "_" + InventoryID.toString();
            $(_idtoPass).addClass("movepin");

            $scope.CurrentLineItemIndex = -1;
            $scope.CurrentInventoryId = -1;
            log.success("Data updated successfully.");




        }

        else {
            log.error("Please fill some value.");
        }
    }


    $scope.ShowErrorMessage = function (Option) {
        switch (Option) {
            case 1:
                log.error("Quantity is required field,please fill quantity in cart items");
                break;
            case 2:
                log.error("Convert Quantity,into this quantity and UOM are required fields,please fill proper values in cart items");
                break;
            case 3:
                log.error("Moveable Quantity and location are required fields,please fill proper values in cart items");
                break;
            case 4:
                log.error("Seems like some items are having same location where it was earlier, please select different location to move");
                break;

            case 5:
                log.error("Seems like you haven't fill all required fields for activity data, please fill them first.")
                break;
            default:

        }




    }


    function CheckintoArray(CurrentIndex) {
        CurrentIndex = CurrentIndex - 1;
        var k = 0;
        if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {
            switch ($scope.CurrentOperation) {
                case "Increase":
                case "Decrease":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "" || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null)) {
                            $scope.IssueType = 1;
                            return true;

                            break;
                        }
                        else if ($scope.CurrentOperation == "Decrease") {


                            if (k == CurrentIndex && $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Convert":

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == null || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == null || $scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "")) {
                            $scope.IssueType = 2;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                return true;
                                break;
                            }
                            else {

                            }

                        }

                    }
                    break;
                case "Move":

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == null || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == null || $scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "")) {
                            $scope.IssueType = 3;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (k == CurrentIndex && $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {

                            $scope.IssueType = 31;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity)) {

                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Apply":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "" || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null)) {
                            $scope.IssueType = 1;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Update":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if (k == CurrentIndex && ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "" || $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == null)) {
                            $scope.IssueType = 1;
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if (k == CurrentIndex && $scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                default:

            }

            for (k = 0; k < $scope.CurrentCart.length; k++) {

                if (k == CurrentIndex && $scope.CurrentCart[k].IsLineItemData != null && $scope.CurrentCart[k].IsLineItemData != undefined && $scope.CurrentCart[k].IsLineItemData.length > 0) {
                    var _x = 0;
                    for (_x = 0; _x < $scope.CurrentCart[k].IsLineItemData.length; _x++) {
                        var _tempValueData = $.trim($scope.CurrentCart[k].IsLineItemData[_x].CfValue);
                        if ($scope.IsActiveTransactionField($scope.CurrentCart[k].IsLineItemData[_x].cfdID) && $scope.CurrentCart[k].IsLineItemData[_x].cfdIsRequired == true && (_tempValueData == "" || _tempValueData == null)) {
                            log.error($scope.CurrentCart[k].IsLineItemData[_x].cfdName + " is required field, please fill some value");
                            CheckScopeBeforeApply();;
                            return true;
                        }
                    }


                }


            }





            return false;

        }
        else {
            return true;
        }
    }
    function CheckintoCustomData(CurrentIndex) {
        var _returnVar = false
        var _tempArray = [];
        $.each($('.customActivityData input, select'), function () {
            var value = $.trim($(this).val());
            var cfdid = $(this).attr('cfd-id');
            if ((value == null || value == undefined || value == "") && (cfdid != undefined && cfdid != null)) {
                var _tempVar = CheckintoCustomFieldList(cfdid);
                _tempArray.push(_tempVar);

            }
            else {

            }
        });
        var i = 0;
        for (var i = 0; i < _tempArray.length; i++) {
            if (_tempArray[i] == true || _tempArray[i] == "true") {
                _returnVar = true;
            }
        }

        return _returnVar;

    }

    function CheckintoCustomFieldList(id) {
        var k = 0;
        for (k = 0; k < $scope.CustomActivityDataList.length; k++) {
            if ($scope.CustomActivityDataList[k].cfdCustomFieldType == "Inventory" && $scope.CustomActivityDataList[k].cfdID == id && $scope.CustomActivityDataList[k].cfdIsRequired == true) {
                $scope.IssueType = 5;
                CheckScopeBeforeApply();
                return true;
            }


        }
        return false;
    }
    $scope.logOut = function () {


        authService.logOut();
        $location.path('/login');
        CheckScopeBeforeApply();
    }
    $scope.changeNav = function () {

        //  $("#myform .swiper-slide input").removeAttr("autofocus");
        $(".swiper-slide-active input:first").focus();
        $(".swiper-slide-active input:first").not("input[type='checkbox']").trigger("click");
        $(".swiper-slide-active input:first").not("input[type='checkbox']").trigger("keypress");
        SoftKeyboard.show();
        //    CheckScopeBeforeApply()

    }

    $scope.ValidateObjectVM = function () {

        var k = 0;
        if ($scope.CurrentCart != null && $scope.CurrentCart.length > 0) {
            switch ($scope.CurrentOperation) {
                case "Increase":
                case "Decrease":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "") {
                            $scope.IssueType = 1;
                            $scope.GoToStep(k);
                            return true;

                            break;
                        }
                        else if ($scope.CurrentOperation == "Decrease") {


                            if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                $scope.GoToStep(k);
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Convert":

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].ConvertTransactionData.ActionToQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity == "" || $scope.CurrentCart[k].ConvertTransactionData.ToUOMID == "") {
                            $scope.IssueType = 2;
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].ConvertTransactionData.ActionFromQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                $scope.GoToStep(k);
                                return true;
                                break;
                            }
                            else {

                            }

                        }

                    }
                    break;
                case "Move":

                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity == "" || $scope.CurrentCart[k].MoveTransactionData.MoveToLocation == "") {
                            $scope.IssueType = 3;
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();
                            return true;

                            break;
                        }
                        else if ($scope.CurrentCart[k].MoveTransactionData.MoveToLocation == $scope.CurrentCart[k].InventoryDataList.iLID) {

                            $scope.IssueType = 31;
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].MoveTransactionData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                $scope.GoToStep(k);

                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Apply":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "") {
                            $scope.IssueType = 1;
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                $scope.GoToStep(k);
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                case "Update":
                    for (k = 0; k < $scope.CurrentCart.length; k++) {
                        if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity == "") {
                            $scope.IssueType = 1;
                            $scope.GoToStep(k);
                            CheckScopeBeforeApply();;
                            return true;

                            break;
                        }
                        else if (_AllowNegative != null && _AllowNegative != "True") {
                            if ($scope.CurrentCart[k].IncreaseDecreaseVMData.ActionQuantity > $scope.CurrentCart[k].InventoryDataList.oquantity) {
                                $scope.GoToStep(k);
                                return true;
                                break;
                            }
                            else {

                            }
                        }

                    }
                    break;
                default:

            }

            for (k = 0; k < $scope.CurrentCart.length; k++) {

                if ($scope.CurrentCart[k].IsLineItemData != null && $scope.CurrentCart[k].IsLineItemData != undefined && $scope.CurrentCart[k].IsLineItemData.length > 0) {
                    var _x = 0;
                    for (_x = 0; _x < $scope.CurrentCart[k].IsLineItemData.length; _x++) {
                        var _tempValueData = $.trim($scope.CurrentCart[k].IsLineItemData[_x].CfValue);
                        if ($scope.IsActiveTransactionField($scope.CurrentCart[k].IsLineItemData[_x].cfdID) && $scope.CurrentCart[k].IsLineItemData[_x].cfdIsRequired == true && _tempValueData == "") {
                            $scope.GoToStep(k);
                            log.error($scope.CurrentCart[k].IsLineItemData[_x].cfdName + " is required field, please fill some value");
                            CheckScopeBeforeApply();;
                            return true;
                        }
                    }


                }


            }





            return false;

        }
        else {
            return true;
        }
    }

    $scope.ValidateObjectVMStop = function (CurrentIndex, Type) {
        switch (Type) {
            case "Cart":
                return CheckintoArray(CurrentIndex);
                break;
            case "Activity":
                return CheckintoCustomData(CurrentIndex);
                break;

            default:
                return false;

        }




    }

    $scope.ScanLocationsearch = function () {
        $scope.SearchLocationValue = "";
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            $scope.SearchLocationValue = result.text;

            CheckScopeBeforeApply()

            setTimeout(function () {
                $scope.OnChangeLocationNameFunction();
                CheckScopeBeforeApply()
            }, 100);



        }, function (error) {
            log.error("Scanning failed: ", error);
        });
    }

}]);




app.directive('bootstrapSwitch', [
        function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    var _id = element[0].id;


                    element.bootstrapSwitch({
                        onText: _id == 'AutoID' ? 'Auto' : 'On',
                        offText: _id == 'AutoID' ? 'Manual' : 'Off'
                    });
                    element.on('switchChange.bootstrapSwitch', function (event, state) {
                        if (ngModel) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });

                    scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
]);
