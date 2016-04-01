/* global LoadingWeights */

(function() {
    'use strict';

    function start() {
        var weight = 288;
        document.getElementById('test-weight-output').innerHTML = LoadingWeights.getLoad(weight);
    }

    start();
} ());