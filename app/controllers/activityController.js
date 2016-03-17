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
    $scope.CurrentStep = 0;
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

    init();

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
                    //  $scope.CurrentActiveObject = $scope.Group[0];
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

        CheckScopeBeforeApply();

        AssignFirstObject();
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
                value = -1;
                break;
            case 0:
                $scope.CurrentClass = "bgm-move";
                $scope.CurrentHeaderClass = "bgm-move";
                $scope.CurrentOperation = "Move";
                $scope.CurrentIcon = "fa-arrow-right";
                $scope.CurrentHeaderText = "Move these items to a different location.";
                break;
            case 1:
                $scope.CurrentClass = "bgm-increase"
                $scope.CurrentHeaderClass = "bgm-increase";
                $scope.CurrentOperation = "Increase";
                $scope.CurrentIcon = "fa-arrow-up";
                $scope.CurrentHeaderText = "Put these items in inventory.";
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




            }




        });
    }


    $scope.GoToStep = function (Index) {

        $(".swiper-slide").each(function () {

            if ($(this).attr("data-index") == Index) {
                mySwiper.swipeTo($(this).index(), 1000, false);


                $scope.CurrentStep = Index;

                return false;
            }

        });


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

                    //   $("#mybutton_" + id).removeClass("rotateData")

                    log.success("Data updated successfully.");
                    //  $scope.NextClickNew(2);
                    //  $scope.CurrentActiveObject = $scope.Group[0];
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

                //    $("#mybutton_" + id).removeClass("rotateData")

                log.success("Data updated successfully.");
                CheckScopeBeforeApply();;

                break;

            default:

        }

    };

    Date.prototype.toMSJSON = function () {
        var date = '/Date(' + this.getTime() + ')/'; //CHANGED LINE
        return date;
    };

    function BuildMultipleData() {
        var dt = new Date();

        alert($("#itUpdateDate").val());
        debugger;
        var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
        var wcfDateStr = dt1.toMSJSON();

        var wcfDateStr1=dt1.toMSJSON();
        var wcfDateStr2=dt1.toMSJSON();

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
                itUpdateDate: wcfDateStr,
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

            if($scope.CurrentCart[k].ApplyTransactionData.UniqueDate != undefined)
            {

                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UniqueDate;
                var dsplit = dateVar.split("/");

                var d1 = new Date(dsplit[2], dsplit[1] - 1, dsplit[0]);

                var d11 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds(), d1.getMilliseconds()))

                wcfDateStr1 = d11.toMSJSON();
            }
            if($scope.CurrentCart[k].ApplyTransactionData.UnitDate2 != undefined)
            {
                var dateVar = $scope.CurrentCart[k].ApplyTransactionData.UnitDate2;
                var dsplit = dateVar.split("/");

                var d2 = new Date(dsplit[2], dsplit[1] - 1, dsplit[0]);

                

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


    $scope.SubmitAllActivities = function () {


        debugger;

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $scope.SecurityToken = authData.token;
        }

        var _mdata = BuildMultipleData();

        console.log(_mdata);

        $.ajax({
            type: "POST",
            url: serviceBase + 'MultipleActivity',
            contentType: 'application/json; charset=utf-8',

            dataType: 'json',
            data: JSON.stringify({ "SecurityToken": $scope.SecurityToken, "data": _mdata }),
            success: function (response) {

                debugger;

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
