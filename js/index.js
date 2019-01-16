

(function ($, window, document, undefined) {


    var pluginName = "addClear";

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
            var $this = $(this.element),
              me = this,
              options = this.options;

            $this.wrap("<div class='add-clear-span form-group has-feedback " + options.wrapperClass + "'></div>");
            $this.after($("<span class='add-clear-x form-control-feedback " + options.symbolClass + "' style='display: none;'>" + options.closeSymbol + "</span>"));
            $this.next().css({
                'color': options.color,
                'cursor': 'pointer',
                'text-decoration': 'none',
                'display': 'none',
                'overflow': 'hidden',
                'position': 'absolute',
                'pointer-events': 'auto',
                'right': options.right,
                'top': options.top,
                'z-index': options.zindex
            }, this);

            if ($this.val().length >= 1 && options.showOnLoad === true) {
                $this.siblings(".add-clear-x").show();
            }

            $this.on('focus.addclear', function () {
                if ($(this).val().length >= 1) {
                    $(this).siblings(".add-clear-x").show();
                }
            });

            $this.on('blur.addclear', function () {
                var self = this;

                if (options.hideOnBlur) {
                    setTimeout(function () {
                        $(self).siblings(".add-clear-x").hide();
                    }, 50);
                }
            });

            $this.on('keyup.addclear', function (e) {

                if (options.clearOnEscape === true && e.keyCode == 27) {
                    $(this).val('').focus();
                    if (options.onClear) {
                        options.onClear($(this).siblings("input"));
                    }
                }
                if ($(this).val().length >= 1) {
                    $(this).siblings(".add-clear-x").show();
                } else {
                    $(this).siblings(".add-clear-x").hide();
                }
            });

            $this.on('input.addclear change.addclear paste.addclear', function () {
                if ($(this).val().length >= 1) {
                    $(this).siblings(".add-clear-x").show();
                } else {
                    $(this).siblings(".add-clear-x").hide();
                }
            });

            $this.siblings(".add-clear-x").on('click.addclear', function (e) {



                $(this).siblings(me.element).val("");
                $(this).hide();
                if (options.returnFocus === true) {
                    $(this).siblings(me.element).focus();
                }
                if (options.onClear) {
                    options.onClear($(this).siblings("input"));
                }
                $(this).siblings(me.element).trigger('input');
                e.preventDefault();
            });
        }

    };

    $.fn[pluginName] = function (options, optionName, optionValue) {
        return this.each(function () {
            if (options === "option") {
                var $this = $(this);
                if (optionName === "show") {
                    $this.siblings(".add-clear-x").show();
                } else if (optionName === "hide") {
                    $this.siblings(".add-clear-x").hide();
                }
            }
            var isSetOption = optionName && optionName !== "show" && optionName !== "hide";
            if (isSetOption) {
                var oldInstance = $.data(this, "plugin_" + pluginName);
                if (!oldInstance || !oldInstance.options) {
                    throw "Cannot set option, plugin was not instantiated";
                }
                oldInstance.options[optionName] = optionValue;
            } else {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this,
                        "plugin_" + pluginName,
                        new Plugin(this, options));
                }
            }

        });
    };

    $.fn[pluginName].Constructor = Plugin;

    var defaults = $.fn[pluginName].defaults = {
        closeSymbol: "",
        symbolClass: 'glyphicon glyphicon-remove-circle',
        color: "#CCC",
        top: 0,
        right: 0,
        returnFocus: true,
        showOnLoad: false,
        onClear: null,
        hideOnBlur: false,
        clearOnEscape: true,
        wrapperClass: '',
        zindex: 100
    };

})(jQuery, window, document);











var myDate = new Date();
var _genVar = 0;
var _timeZone = myDate.getTimezoneOffset();

if (_timeZone == -330) {
    _genVar = 1;
}

function randomStringNew(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


var _Islive = true;

var IsActiveLocationLibrary = true;
var IsActiveStatusLibrary = true;
var IsActiveUOMLibrary = true;
var IsActiveItemLibrary = true;
var IsActiveItemGroupLibrary = true;

$("#mysmallModal").click(function () {
    hideSuccess();
});


$(".signoutbtn").click(function () {
    $("#sidenav-overlay").hide();
    $(".side-nav").hide();
    $("#slide-out").css("right", "-250px");
    $("#slide-out-left").css("left", "-250px");
});


//$(document).on('input', '.prepostCustom', function (e) {
//    // if useing right key move cursor to first position it auto move focus at last character in text box 

//    var prefix = $(this).attr("data-prefix");
//    var suffix = $(this).attr("data-suffix");

//    if ($.trim(prefix) == "") { prefix = "" };
//    if ($.trim(suffix) == "") { suffix = "" };

//    var _TotalLength = prefix.length + suffix.length;
//    var _defaultValue = prefix + suffix;

//    _defaultValue = $(this).attr("data-value");
//    if ($.trim($(this).val()).length != _TotalLength) {
//        var _value = $(this).val();
//        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

//            $(this).val(_defaultValue);
//            $(this).trigger("input");
//        }
//    }
//});



//$(document).on('input', '.prepostCustomActivity', function (e) {
//    // if useing right key move cursor to first position it auto move focus at last character in text box 

//    var prefix = $(this).attr("data-prefix");
//    var suffix = $(this).attr("data-suffix");

//    if ($.trim(prefix) == "") { prefix = "" };
//    if ($.trim(suffix) == "") { suffix = "" };

//    var _TotalLength = prefix.length + suffix.length;
//    var _defaultValue = prefix + suffix;

//    _defaultValue = $(this).attr("data-cvalue");
//    if ($.trim($(this).val()).length != _TotalLength) {
//        var _value = $(this).val();
//        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

//            $(this).val(_defaultValue);
//            $(this).trigger("input");
//        }
//    }
//});



//$(document).on('input', '.prepostCustom , .prepostUnit', function (e) {
//    var _value = $(this).val();
//    if ($.trim(_value) == "") { _value = "" };


//    this.selectionStart = this.selectionEnd = _value.length;

//});




//$(document).on('input', '.prepostUnit', function (e) {

//    var prefix = $(this).attr("data-prefix");
//    var suffix = $(this).attr("data-suffix");

//    if ($.trim(prefix) == "") { prefix = "" };
//    if ($.trim(suffix) == "") { suffix = "" };

//    var _TotalLength = prefix.length + suffix.length;
//    var _defaultValue = prefix + suffix;

//    _defaultValue = $(this).attr("data-value");
//    if ($.trim($(this).val()).length != _TotalLength) {
//        var _value = $(this).val();
//        if (_value.indexOf(prefix) == -1 || _value.indexOf(suffix) == -1) {

//            $(this).val(_defaultValue);
//        }
//    }
//});

function hideSuccess() {
    $("#mysmallModal").removeClass('bounceIn').addClass('bounceOut');

}

function HideWaitingInv() {
    $("#mysmallModalSave").removeClass('bounceIn').addClass('bounceOut');
}
function ShowWaitingInv() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");
    $("#mysmallModalSave").removeClass('bounceOut').addClass('bounceIn');
    $('#mysmallModalSave').show();


}

function ShowGlobalWaitingDiv() {
    $("#mysmallModalWaiting").removeClass('fadeOut').addClass('fadeIn');
    $('#mysmallModalWaiting').show();
}
function HideGlobalWaitingDiv() {
    $("#mysmallModalWaiting").removeClass('fadeIn').addClass('fadeOut');

    setTimeout(function () {
        $("#mysmallModalWaiting").hide();
        $("#mysmallModalWaiting span").html("Loading..");

    }, 500);

}

function ShowSuccess(Message) {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");
    Message = Message != null && Message != undefined ? Message : "Saved";
    $("#mysmallModal").removeClass('bounceOut').addClass('bounceIn');
    $('#mysmallModal').show();
    $('#DataText').html(Message);

    setTimeout(function () {
        hideSuccess();
    }, 250)
}
function ShowLoginSuccess() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");

    $("#myloginModal").removeClass('bounceOut').addClass('bounceIn');
    $('#myloginModal').show();



}


function ShowsignupSuccess() {
    $(".errorcontent").css("background", "rgba(52, 73, 94,0.8)");

    $("#mysignupModal").removeClass('bounceOut').addClass('bounceIn');
    $('#mysignupModal').show();



}



var _CurrentUrl = "Login";
var _isOpenBootbox = false;
var recognition;




$('#menu-toggle').click(function (e) {
    e.stopPropagation();

    $('#wrapper').toggleClass('toggled');


    setTimeout(function () {



        if ($('#wrapper').hasClass('toggled')) {
            $("#sidebaricon").removeClass("fa-bars").addClass("fa-arrow-circle-left animated rollIn")
        }

        else {

            $("#sidebaricon").removeClass("fa-arrow-circle-left animated rollIn").addClass("fa-bars")

        }


    }, 0);


});
$('#wrapper').click(function (e) {
    e.stopPropagation();

});
$('body,html').click(function (e) {
    $('#wrapper').removeClass('toggled');

    setTimeout(function () {



        if ($('#wrapper').hasClass('toggled')) {
            $("#sidebaricon").removeClass("fa-bars").addClass("fa-arrow-circle-left")
        }

        else {

            $("#sidebaricon").removeClass("fa-arrow-circle-left").addClass("fa-bars")

        }






    }, 300);







});


$(".sidebar-nav li a").click(function (e) {

    $("#wrapper").toggleClass("toggled");

    $("#sidebaricon").removeClass("fa-arrow-circle-left").addClass("fa-bars")

});

$(".menuclose").click(function (e) {

    $("#wrapper").toggleClass("toggled");
});





document.addEventListener("deviceready", onDeviceReady, false);

function showAlert() {
    navigator.notification.alert(
        'You are the winner!',  // message
        onConfirmnew,         // callback
        'Game Over',            // title
        'Done'                  // buttonName
    );
}


function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
}

function onConfirmnew() {
    alert('You selected button new ');
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'You are the winner!', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Game Over',           // title
        ['Restart', 'Exit']         // buttonLabels
    );
}




var exitApp = false, intval = setInterval(function () { exitApp = false; }, 1000);
document.addEventListener("backbutton", function (e) {
    e.preventDefault();



    if (exitApp) {

        if (_isOpenBootbox == false) {
            _isOpenBootbox = true;
            bootbox.confirm("Are you sure to exit App ?", function (result) {
                if (result) {
                    clearInterval(intval)
            (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())
                    _isOpenBootbox = false;

                }
                _isOpenBootbox = false;
            });

        }



    }
    else {
        exitApp = true;

        if (_CurrentUrl != "MainMenu") {

            navigator.app.backHistory();
            _isOpenBootbox = false;

        }


    }
}, false);

document.addEventListener("online", onOnline, false);
document.addEventListener("offline", onOffline, false);




var pictureSource;
var destinationType;
var ImageListAndroid = [];
//function onPhotoDataSuccess(imageData) {
//    $("#myModalforlist").modal("hide");

//    // Uncomment to view the base64 encoded image data
//    // console.log(imageData);
//    // alert("photo capture success");
//    //alert(imageData);
//    // Get image handle
//    //
//    //var smallImage = document.getElementById('smallImage');
//    // var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
//    //var compilehtml = $compile(crossicon)($scope);
//    // Unhide image elements
//    //
//    //  smallImage.style.display = 'block';

//    imageData = "data:image/jpeg;base64," + imageData;
//    var _htmltoRender = "<span>'<img  style='height: 60px; width:60px; border:transparent; margin:0px;' src='" + imageData + "'/></span>'";

//    document.getElementById('list123').innerHTML = document.getElementById('list123').innerHTML + _htmltoRender;

//    document.getElementById('list321').innerHTML = document.getElementById('list321').innerHTML + _htmltoRender;

//    $("#defaultimg").hide();

//    // Show the captured photo
//    // The inline CSS rules are used to resize the image
//    //
//    //smallImage.src = "data:image/jpeg;base64," + imageData;
//}


//var mouseEventTypes = {
//    touchstart: "mousedown",
//    touchmove: "mousemove",
//    touchend: "mouseup"
//};

//for (originalType in mouseEventTypes) {
//    document.addEventListener(originalType, function (originalEvent) {
//        event = document.createEvent("MouseEvents");
//        touch = originalEvent.changedTouches[0];
//        event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
//                window, 0, touch.screenX, touch.screenY, touch.clientX,
//                touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
//                touch.metaKey, 0, null);
//        originalEvent.target.dispatchEvent(event);
//    });
//}



function onPhotoDataSuccess(imageData) {

    var _ImgObj = { ImageID: 0, FileName: "", bytestring: "", Size: 0 }
    var _length = 0;
    if ($('#list123').html() != undefined && $('#list123').html() != "" && $('#list123').children("span") != undefined) {
        _length = $('#list123').children("span").length;
    }


    //var id = _length + 1;
    //_ImgObj.ImageID = id;
    var id = randomStringNew(5, '0123456789');
    _ImgObj.ImageID = id;
    var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImageNew(' + id + ')"><i class="fa fa-times"></i></a>';
    var compilehtml = crossicon;

    imageData = "data:image/jpeg;base64," + imageData;
    var _htmltoRender = "<span><img id='" + id + "' style='height: 80px; width:78px; border: 1px solid #ccc; margin:0px; margin-top:0px;' src='" + imageData + "'/>" + compilehtml + "</span>";

    document.getElementById('list123').innerHTML = document.getElementById('list123').innerHTML + _htmltoRender;

    document.getElementById('list321').innerHTML = _htmltoRender;
    document.getElementById('list567').innerHTML = _htmltoRender;
    $(".viewimage").show();
    $("#myModalforlist").modal("hide");

    $("#defaultimg").hide();

    _ImgObj.FileName = "IphoneCapture";
    _ImgObj.bytestring = imageData;

    setTimeout(function () {
        ImageListAndroid.push(_ImgObj);
        $(".removeImage").bind("click", function () {

            removeImageNew($(this).attr("altid"));
        });
    }, 100);

    $(".viewimage").find("div").html(ImageListAndroid.length);


}


function removeImageNew(_this) {



    $("#" + _this).each(function () {

        $(this).parent("span").remove();
    });


    for (var i = 0; i < ImageListAndroid.length; i++) {
        if (ImageListAndroid[i].ImageID == _this) {
            ImageListAndroid.splice(i, 1);
            break;
        }
    }




    removeImageNew(_this)

}



// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);
    //alert("photo url success");
    // Get image handle

    //  alert(imageURI);

    //  var crossicon = '<a class="btn btn-danger removeImage" altid="' + id + '" onclick="removeImage(' + id + ')"><i class="fa fa-times"></i></a>';
    //var compilehtml = $compile(crossicon)($scope);
    // Unhide image elements
    //

    imageURI = "data:image/jpeg;base64," + imageURI;
    var _htmltoRender = "<span>'<img  style='height: 60px; width:60px; border:transparent; margin:0px; ' src='" + imageURI + "'/></span>'";


    document.getElementById('list123').innerHTML = document.getElementById('list123').innerHTML + _htmltoRender;
    document.getElementById('list321').innerHTML = document.getElementById('list321').innerHTML + _htmltoRender;
    document.getElementById('list567').innerHTML = document.getElementById('list567').innerHTML + _htmltoRender;

    $("#defaultimg").hide();
}

// A button will call this function
//
function capturePhoto() {
    //  alert("in capture photo");
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        correctOrientation: true,
        destinationType: destinationType.DATA_URL
    });
}



// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        correctOrientation: true,
        destinationType: destinationType.DATA_URL
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        correctOrientation: true,
        sourceType: source
    });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}


function vibrate() {
    // navigator.notification.vibrate(2000);
}


function playBeep() {
    //navigator.notification.beep(1);
}



function UpdateStatusBar(Type) {

    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if (deviceType != "Android") {
        switch (Type) {
            case -1:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#AF2525");
                    //  $cordovaStatusbar.styleHex("#AF2525");
                }

                break;
            case 0:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#C65E28");
                    //  $cordovaStatusbar.styleHex("#C65E28");

                }
                break;
            case 5:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#8C6900");
                    //  $cordovaStatusbar.styleHex("#C65E28");
                }
                break;
            case 1:

                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#177B3D");
                    //  $cordovaStatusbar.styleHex("#177B3D");

                }
                break;
            case 2:


                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#CE59A1");
                    //   $cordovaStatusbar.styleHex("#CE59A1");
                }

                break;
            case 3:
                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#583782");

                }
                break;
            case 4:


                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#0D190F");

                    //  $cordovaStatusbar.styleHex("#0D190F");

                }
                break;

            case 12:



                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#f8c217");


                }
                break;
            default:
                if (_Islive) {
                    StatusBar.backgroundColorByHexString("#2196F3");


                }
                break;
        }
    }
}


function GetDefaultAccount() {

    $.ajax({

        type: "POST",
        url: "https://test.inventory4.com/API/ClearlyInventoryAPI.svc/DefaultAccount",
        contentType: 'application/json; charset=utf-8',

        dataType: 'json',

        error: function (err, textStatus, errorThrown) {
            $scope.IsLoading = false;
            if (err.readyState == 0 || err.status == 0) {

            }
            else {

                if (textStatus != "timeout") {

                }
            }
        },

        success: function (data) {

            if (data.DefaultAccountResult.Success == true) {

                if (data.DefaultAccountResult != null && data.DefaultAccountResult.Payload != null) {
                    var _data = data.DefaultAccountResult.Payload;


                }
            }
            else {


            }

            $scope.$apply();
        }
    });
}
var recognition;







function scanApiNotification(event) {

    event = JSON.parse(event);


    if (event.type) {
        //  alert('receive an event: ' + event.type);
        //  document.getElementById('eventRec').innerHTML = 'receive an event: ' + event.type;
        // document.getElementById('eventRec').setAttribute("class", "blink");

        //alert(allowsocketmobile);
        if (event.type === 'decodedData') {

            // if (allowsocketmobile == true || allowsocketmobile == 'true') {
            var scannedV = '';
            for (var i = 0; i < event.decodedData.length; i++) {
                scannedV = scannedV + String.fromCharCode(event.decodedData[i]); + '';
            }
            try {
                var $focused = $(':focus');
                $focused.val(scannedV);
                $focused.trigger("change");
            }
            catch (err) {
                alert("Problem in selection");
            }

            // }
            //else {
            // alert("Please Turn On Socket mobile in default setting page");
            //  }



        }
    }




}




function onDeviceReady() {


    SocketScanApi.useScanApi('', scanApiNotification.bind(event));

    window.plugins.NativeAudio.preloadSimple('click', 'audio/click.mp3', function (msg) {
    }, function (msg) {
        alert('error: ' + msg);
    });

    window.plugins.NativeAudio.preloadSimple('dclick', 'audio/d_click.mp3', function (msg) {
    }, function (msg) {
        alert('error: ' + msg);
    });

    navigator.splashscreen.hide();

    //  navigator.splashscreen.hide();
    GetDefaultAccount();


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    $cordovaSplashscreen.hide();



    InitializeModal();



    try {



    }
    catch (err) {
        // alert("into Error");
        alert("Error Occurred during hiding keyboard" + err);
    }
}


// Handle the resume event
//
function onResume() {
    alert("in resume");
}
function onPause() {

    alert("in pause");
}

function onOffline() {

    $(".nointernet").show();
}

function onOnline() {

    $(".nointernet").hide();
}


function doOnOrientationChange() {
    switch (window.orientation) {
        case -90:
        case 90:

            //alert(window.orientation);

            $("#mycartModal").addClass("activitylist")

            break;
        default:
            // alert(window.orientation);
            $("#mycartModal").removeClass("activitylist")
            break;
    }
}

window.addEventListener('orientationchange', doOnOrientationChange);

// Initial execution if needed
doOnOrientationChange();



window.addEventListener('statusTap', function () {
    $('html,body').animate({ scrollTop: 0 }, 800);
});




var addRippleEffect = function (e) {
    var target = e.target;
    if (target.tagName !== 'a') return false;


    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

document.addEventListener('click', addRippleEffect, false);







function ShowSuccessActivity(Message, Type) {

    switch (Type) {
        case -1:
            $(".errorcontent").css("background", "rgba(175,37,37,0.7)");

            break;
        case 0:
            $(".errorcontent").css("background", "rgba(198,94,40,0.7)");
            break;
        case 1:
            $(".errorcontent").css("background", "rgba(23,123,61,0.7)");
            break;
        case 2:

            $(".errorcontent").css("background", "rgba(206,89,161,0.7)");

            break;
        case 3:
            $(".errorcontent").css("background", "rgba(88,55,130,0.7)");
            break;
        case 4:
            $(".errorcontent").css("background", "rgba(13,25,15,0.7)");
            break;
        case 5:
            $(".errorcontent").css("background", "rgba(140, 105,0,0.7)");
            break;
        case 12:

            $(".errorcontent").css("background", "rgba(248,194,23,0.7)");

            break;
        default:

    }
    Message = Message != null && Message != undefined ? Message : "Saved";
    $("#mysmallModal").removeClass('bounceOut').addClass('bounceIn');
    $('#mysmallModal').show();
    $('#DataText').html(Message);

    setTimeout(function () {
        hideSuccess();
    }, 250)
}




$(document).on('input', 'input[type="text"],input[type="number"],.emailtextbox,input[type="password"]', function () {


    $('input[type="text"]:input').not(".hideaddclear").addClear({
        symbolClass: "fa fa-times-circle"
    });
    $('input[type="number"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="password"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="email"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $(this).focus();

    $(this).trigger("change");
});

$(document).on('change', 'input[type="text"],input[type="number"],.emailtextbox,input[type="password"]', function () {

    $('input[type="text"]').not(".hideaddclear").addClear({
        symbolClass: "fa fa-times-circle"
    });
    $('input[type="number"]').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="password"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

    $('input[type="email"]:input').addClear({
        symbolClass: "fa fa-times-circle"
    });

});





