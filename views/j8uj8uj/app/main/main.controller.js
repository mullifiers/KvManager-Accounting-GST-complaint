(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('MainController',     function($scope,$rootScope)
        {
            $scope.$on('$viewContentAnimationEnded', function (event)
                {
                    if ( event.targetScope.$id === $scope.$id )
                    {
                        $rootScope.$broadcast('msSplashScreen::remove');
                    }
                });
        });


})();