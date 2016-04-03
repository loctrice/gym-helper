/* global LoadingWeights */
/* global ajax */

(function() {
    'use strict';

    function start() {
        var request = new ajax();
        request.get('test.php/page-data')
            .then(function(data) {
                var liftData = JSON.parse(data);
                request.get('test.php/jugg-rules')
                    .then(function(response) {
                        var rules = JSON.parse(response);
                        buildPage(liftData, rules);
                    });

            });
    }

    function buildPage(workout, juggRules) {
        //for the first lift that isn't done
        var thisLift;
        for (var i = 0; i < workout.lifts.length; i++) {
            if (workout.lifts[i].done === false) {
                thisLift = workout.lifts[i];
                break;
            }
        }
        
        //build the page
        document.getElementById('lift-name').innerHTML = thisLift.name;
        document.getElementById('lift-week').innerHTML = workout.phase + '\'s Week &nbsp;';
        document.getElementById('phase-name').innerHTML = workout.week + ' Phase';

        //create li's
        var liftObj = juggRules.Rules[workout.phase][workout.week];
        for (var key in liftObj) {
            var reps = liftObj[key].reps;
            var weight = parseInt(thisLift.max, 10) * parseFloat(liftObj[key].percent);
            var loadUp = LoadingWeights.getLoad(weight);
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            var html = '<span class="badge">' + weight + ' lbs</span>' +
                '<span class="label label-primary">' + reps + ' Reps</span>' +
                '&nbsp;&nbsp;<span class="label label-info">' + loadUp + '</span>';
            li.innerHTML = html;
            document.getElementById('lift-display').appendChild(li);
        }
    }

    start();
} ());