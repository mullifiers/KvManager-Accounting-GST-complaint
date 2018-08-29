(function ()
{
    'use strict';

    angular
        .module('app.summary.server',
            [
                // 3rd Party Dependencies
                'nvd3',
                'datatables'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.summary_server', {
            url      : '/summary-server',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/summary/server/summary-server.html',
                    controller : 'summaryerverController as vm'
                }
            },
            resolve  : {
                summaryData: function (msApi)
                {
                    return msApi.resolve('summary.server@get');
                }
            },
            bodyClass: 'summary-server'
        });

        // Api
        msApiProvider.register('summary.server', ['app/data/summary/server/data.json']);
    }

})();