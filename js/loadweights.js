/* exported LoadingWeights */
var LoadingWeights = (function() {
    'use strict';

    // Pair values of available weights to load on the bar (i.e a 45 on each side is 90)    
    var AVAILABLE_WEIGHTS = [90, 70, 50, 20, 10, 5];
    var LOWEST_AVAILABLE_WEIGHT = 4; 
    var BAR_WEIGHT = 45; //olympic bar standard is what we base the load on.
    var load = {};

    var service = {
        getLoad: getLoadString,
        getNewMax: getNewMax
    };
    return service;

    /** Formula to progress through program. This can increment, decrement, or stay the same
     *  depending on the number of reps achieved.
     *  @param {number} wave (i.e. 10's wave, 8's wave, etc)
     *  @param {number} reps completed on AMAP
     *  @param {number} current max for the lift
     *  @param {number} amount to increment (typically 2.5 for arms and 5 for legs)
     */
    function getNewMax(minimumOptimalReps, repsAchieved, currentMax, inrement) {
        var repsPastMinimum = repsAchieved - minimumOptimalReps;
        repsPastMinimum = (repsPastMinimum > 10) ? 10 : repsPastMinimum;
        return ((repsPastMinimum * inrement) + currentMax);
    }

    /** Make a string to dispaly the optimal order of weights to load on the bar.
     *  This will get as close as possible to the weight with the given weights
     */
    function getLoadString(weight) {
        resetLoad();
        weight -= BAR_WEIGHT;
        calculatePlates(weight);
        return makeOutputString();
    }

    /** Create output string for interface. */
    function makeOutputString() {
        var output = '';
        for (var i = 0; i < AVAILABLE_WEIGHTS.length; i++) {
            var plate = load[AVAILABLE_WEIGHTS[i]];
            if (plate.count > 0) {
                output += plate.count + 'x' + plate.plate;
                if (plate.count > 1) {
                    output += '\'s';
                }
                output += ', ';
            }
        }

        // Chop of trailing comma and space (cleaner than logic in the loop, and simpler than another function)        
        output = output.substring(0, output.length - 2); 
        return output;
    }     

    /** Get the optimal load order for the weights. */    
    function calculatePlates(weight) {  
        var sanity = 25; // Don't want an edge case to lock up the browser.              
        while (weight > LOWEST_AVAILABLE_WEIGHT && sanity > 0) {
            sanity--;
            // Find the first amount of weight that will fit, and then stop and break;
            for (var plateIndex = 0; plateIndex < AVAILABLE_WEIGHTS.length; plateIndex++) {
                if (weight - AVAILABLE_WEIGHTS[plateIndex] >= 0) {
                    weight -= AVAILABLE_WEIGHTS[plateIndex];
                    load[AVAILABLE_WEIGHTS[plateIndex]].count++;
                    break;
                }
            }
        }
    }

    /** Set the load object back to it's initial state. */    
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

