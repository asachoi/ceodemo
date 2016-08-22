'use strict';

app.controller('apply-edisclosure-static-questions-ctrl', ['$scope', function ($scope) {
    $scope.data = {
        weight: 0,
        height: 0
    };

    $scope.initSlider = function(sliderId) {
        // var elem = $("#"+sliderId);
        var elem = angular.element("#"+sliderId);
        elem.roundSlider({
            sliderType: "min-range",
            showTooltip: false,
            editableTooltip: false,
            radius: 105,
            width: 16,
            value: 0,
            handleSize: 0,
            handleShape: "round",
            circleShape: "custom-half",
            startAngle: 0,
            change: function (args) {
                $scope.data.weight = args.value;
                $scope.$apply($scope.data.weight);
            }
        });
        $scope.data.slider = elem.data("roundSlider");
    };

    $scope.$watch('data.weight', function(newVal, oldVal) {
        $scope.data.slider.setValue(newVal);
    });

    $scope.clicked = function(i) {
        console.log(i);
    };

    $scope.initRuler = function(rulerScroll, svgV) {
        $scope.data.rulezV = new Rulez({
            element: document.getElementById(svgV),
            layout: 'vertical',
            alignment: 'left',
            textDefaults: {
                rotation: 90,
                centerText: {
                    by: 'height',
                    operation: 'sum' //'sum' or 'sub'
                }
            },
            texts: [
                {
                    pixelGap: 100,
                    offset: 20
                }
            ]
        });
        $scope.data.rulezV.render();
        var scroll = document.getElementById(rulerScroll);
        scroll.addEventListener('scroll', function (evt) {
            $scope.data.rulezV.scrollTo(scroll.scrollTop);
            $scope.data.height = scroll.scrollTop;
            $scope.$apply($scope.data.height);
        });

    };

    $scope.$watch('data.height', function(newVal, oldVal) {
        $scope.data.rulezV.scrollTo(parseInt(newVal));
    });

}]);

