'use strict';

app.controller('apply-esignature-ctrl', ['$scope', function ($scope) {

    $scope.init = function(signId) {
        var wrapper = document.getElementById(signId);
        var canvas = wrapper.querySelector("canvas");
    	var signaturePad = new SignaturePad(canvas);
        var placeholder = angular.element("#" + signId + "-placeholder");
        var clearButton = angular.element("#" + signId + "-clear");
        clearButton.on("click", function (event) {
            signaturePad.clear();
            placeholder.show();
            clearButton.hide();
        });
        signaturePad.onBegin = function() {
            placeholder.hide();
            clearButton.show();
        };
        clearButton.hide();
        // signaturePad.onEnd = function() {placeholder.show()};
        $scope.resizeCanvas(canvas);
    };

    $scope.resizeCanvas = function(canvas) {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

}]);
