'use strict';

var app = angular.module("ceoApp", ["ngAnimate", "ngTouch", "rzModule", "delightMeterApp"],  function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[{');
    $interpolateProvider.endSymbol('}]');
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

app.directive('myclick', function() {
    return function(scope, element, attrs) {
        element.bind('touchstart click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            scope.$apply(attrs['myclick']);
        });
    };
});

app.controller("mainNav-ctrl", ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {

	// handle page navigation
	$scope.goToPage = function(_location) {
		if (_location) {
			window.location.href = _location;
		} else {
			window.history.back();
		}
	};

	// handle index overlay show/hide
	$scope.indexOverlay = angular.element(window.document.getElementById('indexPageOverlay'));
	$scope.openIndexOverlay = function() {
		$scope.indexOverlay.addClass('modal');
	}
	$scope.closeIndexOverlay = function() {
		$scope.indexOverlay.removeClass('modal');
	}

	// handle overlay show/hide
	$scope.overlay = angular.element(window.document.getElementById('pageOverlay'));
	$scope.openOverlay = function() {
		$scope.overlay.addClass('modal');
		var loaders = $scope.overlay.find('.loader');
		if (loaders.length) {
			var toPage = loaders.attr('toPage');
			var waitTime = parseInt(loaders.attr('waitTime'));
			if (toPage) {
				$timeout(function() {
					$scope.goToPage(toPage);
				}, waitTime);
			}
		}
	}
	$scope.closeOverlay = function() {
		$scope.overlay.removeClass('modal');
	}

    $scope.init = function(targetPage, disableFastClick){
		var app = {
		    // Application Constructor
		    initialize: function() {
		        this.bindEvents();
		    },
		    // Bind Event Listeners
		    //
		    // Bind any events that are required on startup. Common events are:
		    // 'load', 'deviceready', 'offline', and 'online'.
		    bindEvents: function() {
		        document.addEventListener('deviceready', this.onDeviceReady, false);
		    },
		    // deviceready Event Handler
		    //
		    // The scope of 'this' is the event. In order to call the 'receivedEvent'
		    // function, we must explicitly call 'app.receivedEvent(...);'
		    onDeviceReady: function() {
		        app.receivedEvent('deviceready');
		    },
		    // Update DOM on a Received Event
		    receivedEvent: function(id) {

		        console.log('Received Event: ' + id);
		        shake.startWatch(app.onShake);
		//        shake.stopWatch();

		        // window.addEventListener("statusTap", app.goBack);
		        window.addEventListener("statusTap", $scope.openIndexOverlay);
		        
		    },
		    goBack: function() {
		    	$scope.goToPage(targetPage);
		    },
		    onShake: function() {
		        console.log("Shaking");
		        this.goBack();
		    }
		};

		app.initialize();
		// if (!disableFastClick) 
			FastClick.attach(document.body);
    };

}]);

app.controller("tab-ctrl", ['$scope', '$timeout', function ($scope, $timeout) {
	$scope.direction = 'left';
	$scope.selectedTab = 0;
	$scope.setTab = function(newTab){
		$scope.direction = (newTab > $scope.selectedTab) ? 'left' : 'right';
		$scope.selectedTab = newTab;
		// In case rzSlider under tab content section
		$timeout(function() {
      		$scope.$broadcast('rzSliderForceRender');
      		// $scope.$broadcast('reCalcViewDimensions');
    	}, 1000);
	};

	$scope.isSetTab = function(tabNum){
		return $scope.selectedTab === tabNum;
	};

	$scope.prevTab = function() {
		$scope.direction = 'right';
		if ($scope.selectedTab != ($scope.tabs.length-1)) {
			$scope.setTab($scope.selectedTab + 1);
		}
	};

	$scope.nextTab = function() {
		$scope.direction = 'left';
		if ($scope.selectedTab != 0) {
		$scope.setTab($scope.selectedTab - 1);
		}
	};

}])
.animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
});
