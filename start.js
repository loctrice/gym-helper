/* global LoadingWeights */
/* global JuggRules */
/* global ajax */

(function() {
    'use strict';

    function start() {
        //get page variable from php
        var request = new ajax();
        request.send('test.php/page-data', 
        function(data){
            buildPage(JSON.parse(data));
        },
        function(){
            alert('error');
        });
    }
    
    function buildPage(page){
        //for the first lift that isn't done
        var today;
        for (var i = 0; i < page.lifts.length; i++) {
            if (page.lifts[i].done === false) {
                today = page.lifts[i];
                break;
            }
        }
        //build the page
        document.getElementById('lift-name').innerHTML = today.name;
        document.getElementById('lift-week').innerHTML = page.phase + '\'s Week &nbsp;';
        document.getElementById('phase-name').innerHTML = page.week + ' Phase';

        //create li's
        var liftObj = JuggRules.Rules[page.phase][page.week];
        for (var key in liftObj) {
            var reps = liftObj[key].reps;
            var weight = parseInt(today.max, 10) * parseFloat(liftObj[key].percent);
            var loadUp = LoadingWeights.getLoad(weight);
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            var html = '<span class="badge">' + weight + ' lbs</span>' +
                '<span class="label label-primary">' + reps + ' Reps</span>' +
                '&nbsp;&nbsp;<span class="label label-info">'+ loadUp +'</span>';
            li.innerHTML = html;
            document.getElementById('lift-display').appendChild(li);
        }
    }

    start();
} ());