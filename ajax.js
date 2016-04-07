/* exported ajax */
/** Represents an ajax request.
* @constructor
*/
function ajax() {
    'use strict';
    
    var service = {
        get: get,
        post: post
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
    
    function post(url, data) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('POST', url);

            //Send the proper header information along with the request
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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

            req.send(data);
        });
    }
}