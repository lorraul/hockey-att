angular.module('molApp')

    .filter('teamsColumn', function () {
        return function (array, column) {
            var results = [];
            var a, b;
            results = array.filter(function (item, index) {
                if (column === 0) {
                    a = 0;
                    b = Math.floor(array.length / 3) + Math.ceil((array.length / 3) % 1) - 1;
                }
                if (column == 1) {
                    a = Math.floor(array.length / 3) + Math.ceil((array.length / 3) % 1);
                    b = 2 * Math.floor(array.length / 3) + Math.ceil((array.length / 3) % 1) + Math.round((array.length / 3) % 1) - 1;
                }
                if (column == 2) {
                    a = 2 * Math.floor(array.length / 3) + Math.ceil((array.length / 3) % 1) + Math.round((array.length / 3) % 1);
                    b = 3 * Math.floor(array.length / 3) + Math.ceil((array.length / 3) % 1) + Math.round((array.length / 3) % 1) - 1;
                }
                if (index >= a && index <= b) return true;
                return false;
            });
            return results;
        };
    })

    .filter('showMore', function ($filter) {
        return function (all, showMore) {
            if (!showMore) return;
            var result = [];
            for (var i = 0; i < all.length; i++) {
                result.push(all[i]);
            }
            return result;
        };
    });
