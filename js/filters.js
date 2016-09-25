angular.module('molApp')

.filter('teamsColumn', function() {
  return function(array, column) {
    var result = [];
    results = array.filter(function(item, index){
        if (
            index >= column*Math.round(array.length/3) 
            && 
            index <= (column*Math.round(array.length/3))+Math.round(array.length/3)-1
        ) return true;
        return false;
    });
    return results;
  };
})

;

