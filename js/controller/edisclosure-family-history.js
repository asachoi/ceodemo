'use strict';

app.controller("edisclosure-family-history-ctrl", ['$scope', '$document', function ($scope, $document) {

  $scope.questionSets1 = [
    {name:"Nasopharngeal Cancer", id:"Nasopharngeal Cancer", disabled:false, checked:false},
    {name:"Multiple Sclerosis", id:"Multiple Sclerosis", disabled:false, checked: false},
    {name:"Ovarian Cancer", id:"Ovarian Cancer", disabled:false, checked: false},
    {name:"Motor Neuron Disease", id:"Motor Neuron Disease", disabled:false, checked: false},
    {name:"Huntington Disease", id:"Huntington Disease", disabled:false, checked: false},
    {name:"Muscular Dystrophy", id:"Muscular Dystrophy", disabled:false, checked: false},
    {name:"Polycystic Kidney Disease", id:"Polycystic Kidney Disease", disabled:false, checked: false},
    {name:"Other hereditary disease(s)", id:"Other hereditary disease(s)", disabled:false, checked: false},
    {name:"None", id:"None1", disabled:false, checked: false}
  ];


  $scope.questionSets2 = [
    {name:"Cervical", id:"Cervical", disabled:false, checked:false},
    {name:"High blood pressure", id:"High blood pressure", disabled:false, checked: false},
    {name:"Colon", id:"Colon", disabled:false, checked: false},
    {name:"Heart problems", id:"Heart problems", disabled:false, checked: false},
    {name:"Other cancer(s)", id:"Other cancer(s)", disabled:false, checked: false},
    {name:"Stroke", id:"Stroke", disabled:false, checked: false},
    {name:"Diabetes", id:"Diabetes", disabled:false, checked: false},
    {name:"Haemochromatosis", id:"Haemochromatosis", disabled:false, checked: false},
    {name:"None", id:"None2", disabled:false, checked: false}
  ];


  $scope.isQuestionSetVisible1 = function(index) {
    return $scope.questionSets1[index].checked;
  };


  $scope.isQuestionSetVisible2 = function(index) {
    return $scope.questionSets2[index].checked;
  };


}]);
