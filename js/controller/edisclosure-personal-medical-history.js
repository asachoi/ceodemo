'use strict';

app.controller("edisclosure-personal-medical-history-ctrl", ['$scope', '$document', function ($scope, $document) {

  $scope.questionSets = [
    {name:"Hypertension", disabled:false, checked:false},
    {name:"Heart attack", disabled:true, checked: false},
    {name:"Diabetes", disabled:true, checked: false},
    {name:"Paralysis", disabled:true, checked: false},
    {name:"Renal failure", disabled:true, checked: false},
    {name:"Cancer/tumor", disabled:true, checked: false},
    {name:"Hepatitis", disabled:true, checked: false},
    {name:"None", disabled:true, checked: false}
  ];

  $scope.questionSet1 = true;
  $scope.toggleQuestion = function(index) {
    if (!$scope.questionSets[index].disabled) {
      $scope.questionSets[index].checked = !$scope.questionSets[index].checked;
    }
  };
  $scope.isQuestionSetVisible = function(index) {
    return $scope.questionSets[index].checked;
  };

  $scope.body = {
    bloodPressureReading: undefined,
  };

}]);
