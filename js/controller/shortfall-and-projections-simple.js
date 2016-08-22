// Based on this reference component
// http://codepen.io/anandthakker/pen/marlo/

'use strict';

app.controller('shortfall-and-projections-simple-ctrl', ['$scope', function ($scope) {
    $scope.updateView = function(index, data) {
        if (data.date <= $scope.goals[index].date) return;
        // console.log("u 1");
        $scope.goals[index].date = data.date;
        var goalModel = $scope.goals[index].model;
        var timeAt = $scope.timelineModel.probs[0];
        var fill = 0;
        // if (timeAt <= goalModel.probs[0]) {
        //     fill = goalModel.vfills[0];
        // } else {
        //     if (timeAt >= (goalModel.probs[0] + goalModel.probs[1])) {
        //         fill = goalModel.vfills[1];
        //     } else {
        //         var deltaFill = goalModel.vfills[1] - goalModel.vfills[0];
        //         var timeSpan = goalModel.probs[1];
        //         fill = goalModel.vfills[0] + deltaFill * (timeAt - goalModel.probs[0]) / timeSpan;
        //     }
        // }
        if (index == 1 && timeAt >= (goalModel.probs[0] + goalModel.probs[1])) {
            fill = goalModel.vfills[1];
        } else {
            var deltaFill = goalModel.vfills[1] - goalModel.vfills[0];
            var timeSpan = goalModel.probs[1];
            fill = goalModel.vfills[0] + deltaFill * (timeAt - goalModel.probs[0]) / timeSpan;
        }
        $scope.goals[index].view.vfills[0] = fill;
        // $scope.goals[index].view.exportData = $scope.timelineModel.exportData;
        // $scope.goals[index].view.exportData.goalAtProbs = [$scope.timelineModel.exportData.goalAtProbs[index]];

        $scope.goals[index].view.exportData = {
            age:$scope.timelineModel.exportData.age,
            ageIndex:$scope.timelineModel.exportData.ageIndex, 
            goalAtProbs:[
                [{
                    need: $scope.timelineModel.exportData.goalAtProbs[0][index].need,
                    saving: $scope.timelineModel.exportData.goalAtProbs[0][index].saving,
                    shortfall: $scope.timelineModel.exportData.goalAtProbs[0][index].shortfall
                }]
            ]
        };
        // console.log($scope.goals[index].view.exportData);
    };
    $scope.onTimelineChange = function(data) {
        $scope.updateView(0, data);
        $scope.updateView(1, data);
    };
    $scope.onGoal0Change = function(data) {
        $scope.updateView(0, data);
    };
    $scope.onGoal1Change = function(data) {
        $scope.updateView(1, data);
    };

    $scope.goalData0 = [
        {need: 7698268, saving: 800000},
        {need: 7926126, saving: 840000},
        {need: 8163910, saving: 882000},
        {need: 8408827, saving: 926100},
        {need: 8661092, saving: 972405},
        {need: 8920925, saving: 1021025},
        {need: 9188553, saving: 1072076},
        {need: 9464209, saving: 1125680},
        {need: 9748136, saving: 1181964},
        {need: 10040580, saving: 1241062},
        {need: 10341797, saving: 1303115},
        {need: 10652051, saving: 1368271},
        {need: 10971613, saving: 1436685},
        {need: 11310734, saving: 1508519},
        {need: 11649856, saving: 1583945},
        {need: 11988977, saving: 1663142},
        {need: 12370884, saving: 1746299},
        {need: 12752791, saving: 1833614},
        {need: 13134697, saving: 1925295},
        {need: 13516604, saving: 2021560},
        {need: 13898511, saving: 2122638},
        {need: 14341245, saving: 2228770},
        {need: 14783980, saving: 2340208},
        {need: 15226714, saving: 2457219},
        {need: 15669449, saving: 2580079},
        {need: 16112183, saving: 2790083},
        {need: 16625434, saving: 2844538},
        {need: 17138685, saving: 2986765},
        {need: 17651935, saving: 3136103},
        {need: 18165186, saving: 3292908},
        {need: 18678437, saving: 3457553},

        // {need: 18678437, saving: 17678437},
    ];

    $scope.goalData1 = [
        {need: 1200000, saving: 20000 * 0},
        {need: 1200000, saving: 20000 * 0},
        {need: 1200000, saving: 20000 * 0},
        {need: 1200000, saving: 20000 * 0},
        {need: 1200000, saving: 20000 * 0},

        {need: 1200000, saving: 20000 * 1},
        {need: 1236000, saving: 20000 * 2},
        {need: 1273080, saving: 20000 * 3},
        {need: 1311272, saving: 20000 * 4},
        {need: 1350610, saving: 20000 * 5},
        {need: 1391129, saving: 20000 * 5},
    ];

    $scope.timelineModel = {
        exportData: {age:0, ageIndex:0, 
            goalAtProbs:[
                [{need:0,saving:0,shortfall:0}, {need:0,saving:0,shortfall:0}]
            ]
        },
        importData: [$scope.goalData0, $scope.goalData1],
        // age: 0,
        // ageIndex: 0,
        handleAlignTop: -10,
        handleClass: 'drag-slider-handle-bar',
        handleKnob: 'bar',
        sliderClass: 'drag-slider-ticker',
        tickValues: ["30","","45","","60"],
        probs: [0, 10],
        listener: $scope.onTimelineChange
    };
    $scope.goalModel0 = {
        exportData: {age:0, ageIndex:0, 
            goalAtProbs:[
                [{need:0,saving:0,shortfall:0}],
                [{need:0,saving:0,shortfall:0}]
            ]
        },
        importData: [$scope.goalData0],
        probs: [0, 10, 0],
        vfills: [4.42516, 49.889919],
        vTarget: 18878437,
        vfillDisplays: [[], [{
            template: "<span>Shortfall $shortfall$</span><br/><br/><span>To avoid this shortfall, an extra $extraMonthlySaving$ is needed per month for the next $year$ years</span>",
            topOffset: -30,
            leftOffset: 65,
            width: 160,}
            ]
        ],
        minDiff: 0.833,
        handleKnob: 'band',
        fillColor: '#8d449a',
        emptyColor: '#c8cccc',
        // allowDownTarget: true,
        // vDraggable: true,
        listener: $scope.onGoal0Change,
        speechClass: 'multi_speech'
    };
    $scope.goalModel1 = {
        exportData: {age:0, ageIndex:0, 
            goalAtProbs:[
                [{need:0,saving:0,shortfall:0}],
                [{need:0,saving:0,shortfall:0}]
            ]
        },
        importData: [$scope.goalData1],
        probs: [10*5/30, 10*5/30, 10*20/30],
        vfills: [0, 13.739066],
        vTarget: 1391128,
        boundaries: [10*5/30, 10*20/30],
        vfillDisplays: [[], [{
            template: "<span>Shortfall $shortfall$</span><br/><br/><span>To avoid this shortfall, an extra $extraMonthlySaving$ is needed per month for the next $year$ years</span>",
            topOffset: -30,
            leftOffset: 65,
            width: 160,}
            ]
        ],
        minDiff: 0.833,
        handleKnob: 'band',
        listener: $scope.onGoal1Change,
        step: 0,
        fillColor: '#006ba7',
        emptyColor: '#c8cccc',
        speechClass: 'multi_speech'
    };
    $scope.goalViewModel0 = {
        isView: true,
        handleClass: 'drag-slider-handle-static-round',
        dragDisabled: true,
        probs: [0,10],
        vfills: [20],
        vTarget: 18078437,
        vfillDisplays: [[{
            template: "",
            topOffset: -10,
            leftOffset: 70,
            width: 75,
            },{
            template: "",
            topOffset: 55,
            leftOffset: 70,
            width: 75,
            }]
        ],
        fillColor: '#8d449a',
        emptyColor: '#c8cccc',
        speechClass: 'speech'
    };
    $scope.goalViewModel1 = {
        isView: true,
        handleClass: 'drag-slider-handle-static-round',
        dragDisabled: true,
        probs: [0,10],
        vfills: [0],
        vTarget: 1391128,
        vfillDisplays: [[{
            template: "",
            topOffset: -10,
            leftOffset: 70,
            width: 75,
            },{
            template: "",
            topOffset: 55,
            leftOffset: 70,
            width: 75,
            }]
        ],
        fillColor: '#006ba7',
        emptyColor: '#c8cccc',
        speechClass: 'speech'
    };
    $scope.goals = [
        { model: $scope.goalModel0, view: $scope.goalViewModel0, date: new Date() },
        { model: $scope.goalModel1, view: $scope.goalViewModel1, date: new Date() },
    ];

}]);

app.directive('slider', ['$document', '$compile', '$filter', function ($document, $compile, $filter) {
    var getTemplate = function(scope) {
        var sliderClassImpl = (scope.model.sliderClass) ? scope.model.sliderClass : 'drag-slider-hidden';
        var ticks = '';
        for (var tickIndex in scope.model.tickValues) {
            ticks += '<li class="tick"><span class="tick-value">' + scope.model.tickValues[tickIndex] + '</span></li>';
        }
        if (ticks != '') {
            ticks = '<ul class="drag-slider-ticks">' + ticks + '</ul>';
        }
        return '<div class="' + sliderClassImpl + '">' + ticks + '</div>'
    };
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        replace: true,
        // template: '<div class="drag-slider-control">\n<div class="drag-slider-ticker">\n</div>\n</div>',
        link: function (scope, element, attrs) {
            element.html(getTemplate(scope)).show();
            $compile(element.contents())(scope);

            var vfillMin = 0, vfillMax = 100;
            var fillColor = (scope.model.fillColor) ? scope.model.fillColor : '#00fe00';
            var emptyColor = (scope.model.emptyColor) ? scope.model.emptyColor : '#ddd';
            var fn, getP, roundHandles, handles, i, j, len, mv, pTotal, setP, step, backgroundCss,
                updateVfill, updateVfill1, updateVfill2, updateProbs, updatePositions;
            element = element.children();
            element.css('position', 'relative');
            handles = [];
            roundHandles = [];
            pTotal = 0;
            step = function () {
                if (scope.model.step != null) {
                    return parseFloat(scope.model.step);
                } else {
                    return 0;
                }
            };
            getP = function (i) {
                return scope.model.probs[i];
            };
            setP = function (i, p) {
                var s;
                s = step();
                if (s > 0) {
                    p = Math.round(p / s) * s;
                }
                return scope.model.probs[i] = p;
            };
            backgroundCss = function(totalVfiles, index, fill) {
                var max = 80;
                if (index == 0) {
                    if (totalVfiles > 1) {
                        max = 90;
                    }
                }
//                max = 80;
                return "-webkit-linear-gradient(top, " + emptyColor + " " + (/*vfillMax*/ max - fill) + "%, " + fillColor + " 0%)";
            };
            updateVfill = function (index) {
                scope.model.vIndex = index;
                updatePositions();
                if (scope.model.listener) {
                    scope.model.listener({
                        date: new Date(),
                    });
                }
            };
            updateVfill1 = function () {
                updateVfill(0);
            };
            updateVfill2 = function () {
                updateVfill(1);
            };
            updateProbs = function () {
                // scope.model.vIndex = 0;
                // updatePositions();
                scope.model.vIndex = 1;
                updatePositions();
                if (scope.model.listener) {
                    scope.model.listener({
                        date: new Date(),
                    });
                }
            };
            updatePositions = function () {
                var handle, i, j, len, p, pRunningTotal, results, x, css;
                pTotal = scope.model.probs.reduce(function (sum, item, i) {
                    return sum + getP(i);
                }, 0);
                pRunningTotal = 0;
                results = [];
                for (i = j = 0, len = handles.length; j < len; i = ++j) {
                    handle = handles[i];
                    p = getP(i);
                    pRunningTotal += p;
                    x = pRunningTotal / pTotal * 100;

                    if (scope.model.exportData != undefined && !scope.model.isView) {
                        var age = 30 * x / 100;
                        var ageIndex = age.toFixed(0); 
                        scope.model.exportData.ageIndex = ageIndex;
                        scope.model.exportData.age = (30 + age).toFixed(0);
                        if (scope.model.importData) {
                            for (var dataIndex = 0; dataIndex < scope.model.importData.length; dataIndex++) {
                                ageIndex = (ageIndex >= scope.model.importData[dataIndex].length) ? scope.model.importData[dataIndex].length -1 : ageIndex;
                                // console.log("ageIndex: " + ageIndex + " " + scope.model.importData[dataIndex][ageIndex].need);
                                scope.model.exportData.goalAtProbs[i][dataIndex] = {
                                    need: scope.model.importData[dataIndex][ageIndex].need,
                                    saving: scope.model.importData[dataIndex][ageIndex].saving,
                                    shortfall: scope.model.importData[dataIndex][ageIndex].need - scope.model.importData[dataIndex][ageIndex].saving
                                };
                            }
                        }
                    }
                    x -= handle.prop('clientWidth') /2 / pTotal;
                    if (scope.model.handleKnob == 'band') {
                        var shiftX = (j == 0) ? 1 : 2;
                        x -= shiftX;
                    }
                    css = { left: x + '%' };
                    css.top = (scope.model.handleAlignTop == undefined) ? ('-' + handle.prop('clientHeight') / 2 + 'px') : scope.model.handleAlignTop;
                    var speechValues = [];
                    if (scope.model.vfills && scope.model.vIndex == j) {
                        if (scope.model.exportData) {
                            scope.model.vfills[scope.model.vIndex] = (scope.model.exportData.goalAtProbs[i][0].saving / scope.model.exportData.goalAtProbs[i][0].need) * 100;
                            // console.log(scope.model.vfills[scope.model.vIndex]);
                        }
                        if (scope.model.vfillDisplays) {
                            var speechValuePercentages = [100 - scope.model.vfills[j], scope.model.vfills[j]];
                            if (speechValuePercentages[1] == 0) {
                                speechValuePercentages[1] = -1;
                            }
                            for (var speechIndex = 0; speechIndex < scope.model.vfillDisplays[j].length; speechIndex++) {
                                // if (scope.model.vfillDisplays[j].length == 2) console.log(scope.model.exportData);
                                var speech = handle.find('#speech' + i + '_' + speechIndex);
                                if (speech.length) {
                                    if (speechValuePercentages[speechIndex] == -1) {
                                        speech.hide();
                                    } else {
                                        speech.show();
                                    }
                                    var vTarget = (scope.model.vTarget) ? scope.model.vTarget : 1;
                                    // speechValues[speechIndex] = (vTarget * speechValuePercentages[speechIndex] / 100);
                                    if (scope.model.exportData) {
                                        speechValues[speechIndex] = (speechIndex == 0) 
                                            ? scope.model.exportData.goalAtProbs[i][0].shortfall 
                                            : scope.model.exportData.goalAtProbs[i][0].saving;
                                        vTarget = $filter('currency')(speechValues[speechIndex], ' HK$', 0);
                                        var speechHtml;
                                        if (scope.model.vfillDisplays[j][speechIndex].template) {
                                            var year = 30 * scope.model.probs[1] / 10;
                                            // var vTarget = (scope.model.vTarget) ? scope.model.vTarget : 1;
                                            year = parseInt(year.toFixed(0));
                                            if (year > 0) {
                                                var extraMonthlySaving = (scope.model.exportData.goalAtProbs[i][0].need - scope.model.exportData.goalAtProbs[i][0].saving) / year / 12;
                                                extraMonthlySaving = $filter('currency')(extraMonthlySaving, 'HK$', 0);
                                                speechHtml = scope.model.vfillDisplays[j][speechIndex].template
                                                                .replace('$shortfall$', vTarget)
                                                                .replace('$extraMonthlySaving$', extraMonthlySaving)
                                                                .replace('$year$', year);
                                            }
                                        } else {
                                            speechHtml = scope.model.vfillDisplays[j][speechIndex].template + vTarget;
                                        }
                                        if (speechHtml) {
                                            speech.html(speechHtml);
                                            // var speechTopOffsets = [-30, 30];
                                            // speech.css({top: speechTopOffsets[speechIndex] + 'px'});
                                            var speechTopOffset = scope.model.vfillDisplays[j][speechIndex].topOffset;
                                            var speechLeftOffset = scope.model.vfillDisplays[j][speechIndex].leftOffset;
                                            var speechWidth = scope.model.vfillDisplays[j][speechIndex].width;
                                            speech.css({top: speechTopOffset + 'px'});
                                            speech.css({left: speechLeftOffset + 'px'});
                                            speech.css({width: speechWidth + 'px'});
                                        }
                                    }
                                }
                            }
                        }
                        css.background = backgroundCss(scope.model.vfills.length, scope.model.vIndex, scope.model.vfills[scope.model.vIndex]);
                        scope.model.vIndex = null;
                    }
                    results.push(handle.css(css));
                    var band = roundHandles[0];
                    if (band) {
                        var x1 = handles[0].css('left').split("px")[0];
                        var x2 = handles[1].css('left').split("px")[0];
                        if (!isNaN(x1) && !isNaN(x2)) {
                            band.css({width: x2 - x1, left: parseInt(x1)+28});
                            // var year = 30 * scope.model.probs[1] / 10;
                            // // var vTarget = (scope.model.vTarget) ? scope.model.vTarget : 1;
                            // year = parseInt(year.toFixed(0));
                            // if (year > 0) {
                            //     // var extraMonthlySaving = (vTarget * (100 -scope.model.vfills[1]) / 100) / year / 12;
                            //     var extraMonthlySaving = (scope.model.exportData.goalAtProbs[i][0].need - scope.model.exportData.goalAtProbs[i][0].saving) / year / 12;
                            //     extraMonthlySaving = $filter('currency')(extraMonthlySaving, 'HK$', 0);
                            //     var statusTemplate = "Extra $extraMonthlySaving$ needed per month for next $year$ years to avoid shortfall";
                            //     var statusText = statusTemplate.replace("$extraMonthlySaving$", extraMonthlySaving);
                            //     statusText = statusText.replace("$year$", year.toFixed(0));
                            //     roundHandles[0].find(".drag-slider-handle-round-band-status").html(statusText);
                            // }
                        }
                    }
                }
                return results;
            };
            fn = function (mv, i) {
                var handle, startPleft, startPright, startX, startY, handleClass;
                if (i === scope.model.probs.length - 1) {
                    return;
                }
                var bandFirst = false;
                var handleKnob = '';
                switch (scope.model.handleKnob) {
                    case 'bar':
                        handleKnob = '<div class="arrow-down"></div><div class="arrow-up"></div>';
                        break;
                    case 'band':
                        if (i == 0) {
                            handleKnob = '<div class="drag-slider-handle-round-band"><p class="drag-slider-handle-round-band-status"></p></div>';
                            bandFirst = true;
                        }
                        break;
                }
                if (scope.model.vfillDisplays) {
                    for (var j = 0; j < scope.model.vfillDisplays[i].length; j++) {
                        handleKnob += '<p class="' + scope.model.speechClass + '" id="speech' + i + '_' + j + '"></p>';
                    }
                }
                handleClass = (scope.model.handleClass) ? scope.model.handleClass : "drag-slider-handle-round";
                if (bandFirst) {
                    roundHandles[0] = angular.element(handleKnob);
                    element.append(roundHandles[0]);
                    handle = angular.element('<div class="' + handleClass + '"></div>');
                } else {
                    handle = angular.element('<div class="' + handleClass + '">' + handleKnob + '</div>');
                }
                handle.css('position', 'absolute');
                handles.push(handle);
                element.append(handle);
                startX = startY = 0;
                startPleft = startPright = 0;
                if (scope.model.dragDisabled) return;
                return handle.on('mousedown touchstart', function (event) {
                    var mousemove, mouseup, getScreenX, getScreenY;
                    getScreenX = function(e) {
                        return (e.screenX) ? e.screenX : e.originalEvent.touches[0].screenX;
                    };
                    getScreenY = function(e) {
                        return (e.screenY) ? e.screenY : e.originalEvent.touches[0].screenY;
                    };
                    mousemove = function (_this) {
                        var vIndex = i;
                        return function (event) {
                            return scope.$apply(function () {
                                var dp = (getScreenX(event) - startX) / element.prop('clientWidth') * pTotal;
                                if (dp < -startPleft || dp > startPright) {
                                    return;
                                }
                                var newPleft = startPleft + dp;
                                var newPright = startPright - dp;
                                if (scope.model.boundaries) {
                                    var totalLeft = newPleft;
                                    var totalRight = newPright;
                                    if (i == 0) {
                                        totalRight = newPright + scope.model.probs[2];
                                    } else {
                                        totalLeft = newPleft + scope.model.probs[0];
                                    }
                                    var delta = scope.model.boundaries[0] - totalLeft;
                                    if (delta > 0) {
                                        newPleft += delta;
                                        newPright -= delta;
                                    }
                                    delta = totalRight - scope.model.boundaries[1];
                                    if (delta < 0) {
                                        newPright -= delta;
                                        newPleft += delta;
                                    }
                                }
                                if (scope.model.minDiff) {
                                    if (i == 0) {
                                        if (newPright < scope.model.minDiff) {
                                            var deltaDiff = scope.model.minDiff - newPright;
                                            newPright = scope.model.minDiff;
                                            newPleft -= deltaDiff;
                                        }
                                    } else {
                                        if (newPleft < scope.model.minDiff) {
                                            var deltaDiff = scope.model.minDiff - newPleft;
                                            newPleft = scope.model.minDiff;
                                            newPright -= deltaDiff;
                                        }
                                    }
                                }
                                setP(i, newPleft);
                                setP(i + 1, newPright);

                                if (scope.model.vDraggable) {
                                    if (scope.model.vfills) {
                                        var dp2 = getScreenY(event) - startY;
                                        var vfill = scope.model.vfills[vIndex];
                                        vfill -= dp2;
                                        var min = vfillMin;
                                        var max = vfillMax;
                                        if (!scope.model.allowDownTarget) {
                                            min = (vIndex > 0) ? scope.model.vfills[vIndex - 1] : vfillMin;
                                            max = (vIndex < scope.model.vfills.length - 1) ? scope.model.vfills[vIndex + 1] : vfillMax;
                                        }
                                        if (vfill < min) vfill = min;
                                        if (vfill > max) vfill = max;
                                        scope.model.vfills[vIndex] = vfill;
                                        startY = getScreenY(event);
                                    }

                                }
        
                            });
                        };
                    }(this);
                    mouseup = function () {
                        $document.unbind('mousemove touchmove', mousemove);
                        return $document.unbind('mouseup touchend touchcancel', mouseup);
                    };
                    event.preventDefault();
                    startX = getScreenX(event);
                    startY = getScreenY(event);
                    startPleft = getP(i);
                    startPright = getP(i + 1);
                    $document.on('mousemove touchmove', mousemove);
                    return $document.on('mouseup touchend touchcancel', mouseup);
                });
            };
            for (i = j = 0, len = scope.model.probs.length; j < len; i = ++j) {
                mv = scope.model.probs[i];
                fn(mv, i);
            }
            if (scope.model.vfills) {
                scope.$watch('model.vfills[0]', updateVfill1, true);
                scope.$watch('model.vfills[1]', updateVfill2, true);
            }
            return scope.$watch('model.probs', updateProbs, true);
        }
    };
}]);
