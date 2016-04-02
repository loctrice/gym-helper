var LoadingWeights = (function() {
    'use strict';

    var AVAILABLE_WEIGHTS = [90, 70, 50, 20, 10, 5];
    var load = {};

    var service = {
        getLoad: getLoadString
    };
    return service;

    function getLoadString(weight) {
        weight -= 45;
        resetLoad();
        var weightsUsed = calculatePlates(weight);
        var output = '';
        for (var i = 0; i < weightsUsed.length; i++) {
            load[weightsUsed[i]].count++;
        }

        for (var j = 0; j < AVAILABLE_WEIGHTS.length; j++) {
            var plate = load[AVAILABLE_WEIGHTS[j]];
            if (plate.count > 0) {
                output += plate.count + 'x' + plate.plate;
                if (plate.count > 1) {
                    output += '\'s';
                }
                output += ', ';
            }

        }
        output = output.substring(0, output.length - 2);
        return output;
    }

    function canDecrement(number, divisor) {
        return (number - divisor > 0);
    }

    function calculatePlates(weight) {
        var sanity = 150;
        var amountsUsed = [];
        while (weight > 0 && sanity > 0) {
            weight = decrement(weight, amountsUsed);
            sanity--;
        }
        return amountsUsed;
    }

    function decrement(weight, amountsUsed) {
        for (var plateIndex = 0; plateIndex < AVAILABLE_WEIGHTS.length; plateIndex++) {
            var decremented = canDecrement(weight, AVAILABLE_WEIGHTS[plateIndex]);
            if (decremented) {
                weight -= AVAILABLE_WEIGHTS[plateIndex];
                amountsUsed.push(AVAILABLE_WEIGHTS[plateIndex]);
                return weight;
            }
        }
        return weight;
    }

    function resetLoad() {
        load = {
            90: { plate: 45, count: 0 },
            70: { plate: 35, count: 0 },
            50: { plate: 25, count: 0 },
            20: { plate: 10, count: 0 },
            10: { plate: 5, count: 0 },
            5: { plate: 2.5, count: 0 }
        };
    }
} ());

