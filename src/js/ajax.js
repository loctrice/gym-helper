export default class ajax{
    'use strict';

    constructor(){}

    /** Sends a get request to a given url and returns a promise. */
    get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            setupRequest(req, resolve, reject);
            req.send();
        });
    }

    /** Send a post with form data.
     *  Note: Data must be in key value url style.
     *  i.e. -  foo=bar&foobar=taco*/
    post(url, data) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('POST', url);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            setupRequest(req, resolve, reject);
            req.send(data);
        });
    }

    /** Sets up the request object to use the promise when it returns.
     *  @param {XMLHttpRequest} request object
     *  @param {method} method to call when success happens
     *  @param {method} method to call when things don't go as planned
     */
    setupRequest(req, resolve, reject) {
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
    }
}