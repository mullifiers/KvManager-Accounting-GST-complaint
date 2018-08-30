(function ()
{
    'use strict';

    angular
        .module('app.summary.project',
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
        $stateProvider.state('app.summary_project', {
            url      : '/summary-project',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/summary/project/summary-project.html',
                    controller : 'summaryProjectController as vm'
                }
            },
            resolve  : {
                summaryData: function (msApi)
                {
                    return msApi.resolve('summary.project@get');
                }
            },
            bodyClass: 'summary-project'
        });

        // Api
        msApiProvider.register('summary.project', ['app/data/summary/project/data.json']);
    }

})();