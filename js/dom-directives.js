angular.module('molApp')

//add more option to long navbar menu
//inspired by: http://blog.sodhanalibrary.com/2014/01/responsive-menu-or-navigation-bar-with.html
.directive('more', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            //navbar more option only at screen sizes > sm
            if (angular.element(document).width() >= 768) alignMenu();
            
            angular.element(window).resize(function(){
                angular.element(element).append(angular.element('#' + element[0].id + ' li.hideshow ul').html());
                angular.element('#' + element[0].id + ' li.hideshow').remove();
                if (angular.element(document).width() >= 768) {
                    alignMenu();
                }
            });
            
            function alignMenu() {
                var w = 0;
                var mw = angular.element(element).width() - 300;
                var i = -1;
                var menuhtml = '';
                angular.forEach(angular.element(element).children(), function(value, key) {
                    i++;
                    w += angular.element(value).outerWidth(true);
                    if (mw < w) {
                        menuhtml += angular.element('<div>').append(angular.element(value).clone()).html();
                        angular.element(value).remove();
                    }
                });
                angular.element(element).append(
                        '<li  style="position:relative;" href="#" class="hideshow">'
                                + '<a style="cursor:pointer">More &nbsp;&nbsp;'
                                + '<span style="font-size:10px" class="glyphicon glyphicon-chevron-down"></span>'
                                + '</a><ul>' + menuhtml + '</ul></li>');
                angular.element('#' + element[0].id + ' li.hideshow ul').css("top", $('#' + element[0].id + ' li.hideshow').outerHeight(true) + 'px');
                angular.element('#' + element[0].id + ' li.hideshow').click(function(e) {
                    angular.element(this).children('ul').toggle();
                    angular.element(this).toggleClass( 'active' );
                    e.stopPropagation();
                });
                
                //close navbar dropdown if outside click
                angular.element(document).click(function(){
                    angular.element('#' + element[0].id + ' li.hideshow').children('ul').hide();
                    angular.element('#' + element[0].id + ' li.hideshow').removeClass( 'active' );
                });
            }
        }
    };
});