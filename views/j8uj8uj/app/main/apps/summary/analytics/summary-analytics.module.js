(function ()
{
    'use strict';

    angular
        .module('app.summary.analytics',
            [
                // 3rd Party Dependencies
                'nvd3'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider)
    {
        // State
        $stateProvider.state('app.summary_analytics', {
            url      : '/summary-analytics',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/summary/analytics/summary-analytics.html',
                    controller : 'summaryAnalyticsController as vm'
                }
            },
            resolve  : {
                summaryData: function (msApi)
                {
                    return msApi.resolve('summary.analytics@get');
                }
            },
            bodyClass: 'summary-analytics'
        });

        // Api
        msApiProvider.register('summary.analytics', ['app/data/summary/analytics/data.json']);
    }

})();