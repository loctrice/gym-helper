/* global ajax */
window.ConfigurationUtils = (function () {
    'use strict';
    
    var API_PAGE = 'test.php';
    var PAGE_DATA_ENDPOINT = 'page-data';
    
    var service = {
        post: postData,
        get: getData
    };
    return service;
    
    /** Post updated data to api. */
    function postData(data){
        var post = new ajax();
        post.post(API_PAGE + '/' + PAGE_DATA_ENDPOINT , 'data=' + JSON.stringify(data));
    }
    
    /** Get workout data and ruleset from api. */
    function getData(caller){
        var request = new ajax();
        request.get(API_PAGE + '/' + PAGE_DATA_ENDPOINT)
            .then(function(data) {
                var liftData = JSON.parse(data);
                caller.setState({
                    data: liftData,
                    loaded: true
                });
            });
    }
}());