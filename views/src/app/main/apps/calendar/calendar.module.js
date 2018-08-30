(function ()
{
    'use strict';

    angular
        .module('app.calendar',
            [
                // 3rd Party Dependencies
                'ui.calendar'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider,msApiProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.calendar', {
            url      : '/calendar',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/calendar/calendar.html',
                    controller : 'CalendarController as vm',
                    resolve: {
                    Events: function (api) {
                                    return new Promise(function(resolve){
                                        api.events.find({},function(err,d){
                                            //console.log(err);
                                            resolve(d);
                                        });
                                    });
                            }
                    }
                }
            },
            bodyClass: 'calendar'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/calendar');
        
        
        
        // Navigation
        msNavigationServiceProvider.saveItem('apps.calendar', {
            title : 'Calendar',
            icon  : 'icon-calendar-today',
            state : 'app.calendar',
            weight: 2
        });
    }
})();