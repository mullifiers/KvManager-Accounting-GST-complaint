(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Common 3rd Party Dependencies
            'uiGmapgoogle-maps',
            'textAngular',
            'xeditable',

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Apps
            'app.summary',
            'app.invoices',
            'app.contacts',
            'app.calendar',
            'app.ratelists',
            'app.notes',




            //-------------------- custom utility -------------------//
            'config.port',
            'printer',
            'invoicing'
            //-------------------------------------------------------//
        ])

})();
