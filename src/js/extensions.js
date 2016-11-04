(function () {
    'use strict';
    
    /** Move an item from index a to index b 
     *  var arr = [ 'a', 'b', 'c', 'd', 'e'];
     *  arr.move(3,1);//["a", "d", "b", "c", "e"]
     *  @param {number} starting index, or index of the item to move
     *  @param {number} ending index, or item destination
    */
    if(typeof Array.prototype.move !== 'function'){
        Array.prototype.move = function(from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };
    }
    
}());