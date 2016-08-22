'use strict';

app.controller("holisticFinancialPlanning-ctrl", ['$scope', '$controller', function ($scope, $controller) {

  $controller('tab-ctrl', { $scope: $scope });

  $scope.tabs = [
    { name: "About Manulife", page: "../components/_holistic-planning-about-manulife.html"},
    { name: "About Me", page: "../components/_holistic-planning-about-me.html"},
    { name: "Our Approach", page: "../components/_holistic-planning-our-approach.html"},
    { name: "People Like You", page: "../components/_holistic-planning-people-like-you.html"},
    { name: "Your Goals", page: "../components/_holistic-planning-your-goals.html"}
  ];

  $scope.selectedTypeIndex = 0;
  $scope.planningGroups = [
    {
      type: "",
      pyramidImg: "../images/content/financial-plan-blank.png",
      goals: [
      ]
    },
    {
      type: "Young family",
      disabled: false,
      pyramidImg: "../images/content/financial-plan-young-family.png",
      goals: [
        { name: "Ensure well-being of family & dependents in the event of death", stars: 2, icon: "imageIconYellowUmbrella" },
        { name: "Cover normal healthcare costs", stars: 1, icon: "imageIconEmergencyKit" },
        { name: "Protect against serious illness", stars: 0, icon: "imageIconHeartEKG" },
        { name: "Save for retirement", stars: 0, icon: "imageIconBeach" },
        { name: "Save for children's education", stars: 1, icon: "imageIconDuck" },
        { name: "Buy a home", stars: 0, icon: "imageIconYellowHome" }
      ]
    },
    {
      type: "DINKs",
      disabled: true,
      pyramidImg: "../images/content/financial-plan-DINKs.png",
      goals: [
        { name: "2 Save for retirement", stars: 0, icon: "icon--retirement" },
        { name: "2 Save for children's education", stars: 0, icon: "icon--children" },
        { name: "2 Cover normal healthcare costs", stars: 0, icon: "icon--healthCare" },
        { name: "2 Generate income for retirement", stars: 0, icon: "icon--income" },
        { name: "2 Leave a legacy", stars: 0, icon: "icon--legacy" },
        { name: "2 x", stars: 0, icon: "icon--x" },
        { name: "2 x", stars: 0, icon: "icon--x" }
      ]
    },
    {
      type: "Pre retirement",
      disabled: true,
      pyramidImg: "../images/content/financial-plan-pre-retirement.png",
      goals: [
        { name: "3 Save for retirement", stars: 0, icon: "icon--retirement" },
        { name: "3 Save for children's education", stars: 0, icon: "icon--children" },
        { name: "3 Cover normal healthcare costs", stars: 0, icon: "icon--healthCare" },
        { name: "3 Generate income for retirement", stars: 0, icon: "icon--income" },
        { name: "3 Leave a legacy", stars: 0, icon: "icon--legacy" },
        { name: "3 x", stars: 0, icon: "icon--x" },
        { name: "3 x", stars: 0, icon: "icon--x" }
      ]
    },
    {
      type: "Gen Y",
      disabled: false,
      pyramidImg: "../images/content/financial-plan-gen-y.png",
      goals: [
        { name: "Save for retirement", stars: 2, icon: "imageIconBeach" },
        { name: "Ensure well-being of family & dependents in the event of death", stars: 1, icon: "imageIconYellowUmbrella" },
        { name: "Buy a home", stars: 1, icon: "imageIconYellowHome" },
        { name: "Protect against a major accident or disability", stars: 1, icon: "imageIconWheelchair" },
        { name: "Cover normal healthcare costs", stars: 0, icon: "imageIconEmergencyKit" },
        { name: "Others", stars: 0, icon: "imageIconCoinChart" }
      ]
    },
  ];

  $scope.selectType = function(newTypeIndex) {
    if (!$scope.planningGroups[newTypeIndex].disabled) {
      $scope.selectedTypeIndex = newTypeIndex;
    }
  };

  $scope.isSelectedType = function(typeIndex) {
    return $scope.selectedTypeIndex === typeIndex;
  };

  $scope.hasMoreStarThan = function(goal, starCount) {
    return goal.stars > starCount;
  };

  $scope.toggleStar = function(goal, starIndex) {
    var stars = goal.stars;
    if (stars == 1) {
      if (starIndex == 0) {
        goal.stars = 0;
      } else {
        goal.stars = 2;
      }
    } else {
      goal.stars = 1;
    }
  };

}]);
