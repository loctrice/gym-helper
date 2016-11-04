/* global ajax */
window.LiftProgramUtils = (function () {
    'use strict';
    
    var API_PAGE = 'test.php';
    var PAGE_DATA_ENDPOINT = 'page-data';
    var RULES_ENDPOINT = 'jugg-rules';
    
    var service = {
        post: postData,
        get: getData,
        getLiftIndex: getLiftIndex,
        setAllLiftsFalse: setAllLiftsUndone,
        getReps: getReps
    };
    return service;
    
    /** Post updated data to api. */
    function postData(data){
        var post = new ajax();
        post.post(API_PAGE + '/' + PAGE_DATA_ENDPOINT, 'data=' + JSON.stringify(data));
    }
    
    /** Get workout data and ruleset from api. */
    function getData(caller){
        var request = new ajax();
        request.get(API_PAGE + '/' + PAGE_DATA_ENDPOINT)
            .then(function(data) {
                var liftData = JSON.parse(data);
                request.get(API_PAGE + '/' + RULES_ENDPOINT)
                    .then(function(response) {
                        var rules = JSON.parse(response);
                        var liftIndex = getLiftIndex(liftData);
                        caller.setState({
                            liftData: liftData,
                            maxReps: liftData.phase,
                            rules: rules,
                            liftIndex: liftIndex,
                            loaded: true
                        });
                    });
            });
    }
    
    /** Find the index of the first incomplete lift. */
    function getLiftIndex(liftData){
        for (var i = 0; i < i < liftData.lifts.length; i++) {
            if (liftData.lifts[i].done === false) {
                return i;
            }
        }
    }
    
    /** Set all the lifts done property to false. Useful when moving from one way to another. */
    function setAllLiftsUndone(liftData){
        for(var i = 0; i < liftData.lifts.length; i++){
            liftData.lifts[i].done = false;
        }
    }
    
    /** Get the reps from the last set in a given rule.
     *  @param {Object} rules object for program
     */
    function getReps(rule){
        return rule[Object.keys(rule).sort().pop()].reps;
    }
}());