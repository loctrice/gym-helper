/* exported LoadingWeights */
var LoadingWeights = (function() {
    'use strict';

    var AVAILABLE_WEIGHTS = [90, 70, 50, 20, 10, 5];
    var BAR_WEIGHT = 45;
    var load = {
        90: { plate: 45, count: 0 },
        70: { plate: 35, count: 0 },
        50: { plate: 25, count: 0 },
        20: { plate: 10, count: 0 },
        10: { plate: 5, count: 0 },
        5: { plate: 2.5, count: 0 }
    };

    var service = {
        getLoad: getLoadString
    };
    return service;

    /** Calculate number of plates of each type to load onto the bar.
     *  @param {number} weight to reach.
     */
    function getLoadString(weight) {
        weight -= BAR_WEIGHT;
        calculatePlates(weight);
        return makeOutput();
    }

    /** Create output string for interface. */
    function makeOutput() {
        var output = '';
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

    /** Checks to see if the divisor can be subtrated from the number. 
     *  @param {number} number to check.
     *  @param {number} number to subtract from first argument.
    */
    function canDecrement(number, divisor) {
        return (number - divisor > 0);
    }

    /** Find the best set of weights to get closest to the goal weight.
     *  @param {number} weight to attempt to reach.
     */
    function calculatePlates(weight) {
        var sanity = 150;
        while (weight > 0 && sanity > 0) {
            weight = decrement(weight);
            sanity--;
        }
    }

    /** Find the first available weight that can be subtracted from the goal weight and
     *  record it in the load object.
     *  @param {number} weight to subtract from.
     */
    function decrement(weight) {
        for (var plateIndex = 0; plateIndex < AVAILABLE_WEIGHTS.length; plateIndex++) {
            var thisPlate = AVAILABLE_WEIGHTS[plateIndex];
            var decremented = canDecrement(weight, thisPlate);
            if (decremented) {
                weight -= thisPlate;
                load[thisPlate].count++;
                return weight;
            }
        }
        return weight;
    }
} ());

