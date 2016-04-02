/* exported ajax */
/** Represents an ajax request.
* @constructor
*/
function ajax() {
    'use strict';
    var requestType = 'GET';
    var service = {
        send: send
    };

    return service;

    /** Make the ajax call.
    * @param {string} url to make request
    * @param {method} callback function for success
    * @param {method} callback function for error
    */
    function send(url, callback, errorCallback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    if (typeof(callback) === 'function') {
                        callback(xmlhttp.responseText);
                    }
                }
                else if (xmlhttp.status === 400) {
                    if (typeof(errorCallback) === 'function') {
                        errorCallback(xmlhttp.satus);
                    }
                }
                else {
                    if (typeof(errorCallback) === 'function') {
                        errorCallback(xmlhttp.status);
                    }
                }
            }
        };

        xmlhttp.open(requestType, url, true);
        xmlhttp.send();
    }
}