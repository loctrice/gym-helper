/* exported ajax */
/** Represents an ajax request.
* @constructor
*/
function ajax() {
    'use strict';
    
    var service = {
        get: get
    };

    return service;

    function get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                if (req.status === 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };

            req.onerror = function() {
                reject(Error('Network Error'));
            };

            req.send();
        });
    }
}