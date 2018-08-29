(function ()
{
    'use strict';

    angular
        .module('app.contacts',
            [
                // 3rd Party Dependencies
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        $stateProvider.state('app.contacts', {
            url    : '/contacts',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/contacts/contacts.html',
                    controller : 'ContactsController as vm'
                }
            },
            resolve: {
                User: function (msApi)
                {
                    return msApi.resolve('contacts.user@get');
                },
                Contacts: function (api)
                {
                     return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
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
        $translatePartialLoaderProvider.addPart('app/main/apps/contacts');

        // msApiProvider.register('contacts.contacts', ['app/data/contacts/contacts.json']);
        msApiProvider.register('contacts.user', ['app/data/contacts/user.json']);
        msApiProvider.register('pos-states', ['app/utility/states.json']);

        
        // Navigation
        msNavigationServiceProvider.saveItem('apps.contacts', {
            title : 'Contacts',
            icon  : 'icon-account-box',
            state : 'app.contacts',
            weight: 10
        });

    }

})();