(function ()
{
    'use strict';

    angular
        .module('app.summary',
            [
                'app.summary.project',
                'app.summary.server',
                'app.summary.analytics'
            ]
        )
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('apps', {
            title : 'REPORTS',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.summary', {
            title : 'Summary',
            icon  : 'icon-tile-four',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.summary.project', {
            title: 'Project',
            state: 'app.summary_project'
        });

        msNavigationServiceProvider.saveItem('apps.summary.server', {
            title: 'Server',
            state: 'app.summary_server'
        });

        msNavigationServiceProvider.saveItem('apps.summary.analytics', {
            title: 'Analytics',
            state: 'app.summary_analytics'
        });
    }

})();