(function ()
{
    'use strict';

    angular
        .module('app.ratelists',
            [
                // 3rd Party Dependencies
                'ratelists.service',
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        
        $stateProvider.state('app.ratelists', {
            url    : '/ratelists',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/ratelists/ratelists.html',
                    controller : 'RatelistsController as vm'
                }
            },
            resolve: {
                User: function (msApi)
                {
                    return msApi.resolve('ratelists.user@get');
                },
                Ratelists: function (api)
                {
                    return new Promise(function(resolve){
                                api.ratelists.find({},function(err,d){
                                    console.log('yppppi');
                                    resolve(d);
                                });
                        })
                },
                POS: function (msApi)
                {
                    return msApi.resolve('pos-states@get');
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/ratelists');

        // Api
        msApiProvider.register('ratelists.user', ['app/data/ratelists/user.json']);
       
        // Navigation
        msNavigationServiceProvider.saveItem('apps.ratelists', {
            title : 'Rate Lists',
            icon  : 'icon-cash-usd',
            state : 'app.ratelists',
            weight: 10
        });
        
    }

})();