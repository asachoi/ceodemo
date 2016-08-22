'use strict';

app.controller("holistic-planning-our-approach-ctrl", ['$scope', function ($scope) {

  $scope.initImageMap = function() {
  	angular.element('img[usemap]').rwdImageMaps();

    angular.element( ".contentPopBoxClose" ).on( "click", function(e) {
        e.preventDefault();
        $(this).parent().hide();
    });

    angular.element( "#1" ).on( "click", function(e) {
        e.preventDefault();
        $("[id^='content']").hide();
        $( "#content-grow" ).show();
    });

    angular.element( "#2" ).on( "click", function(e) {
        e.preventDefault();
        $("[id^='content']").hide();
        $( "#content-connect" ).show();
    });

    angular.element( "#3" ).on( "click", function(e) {
        e.preventDefault();
        $("[id^='content']").hide();
        $( "#content-customize" ).show();
    });
  };

}]);
