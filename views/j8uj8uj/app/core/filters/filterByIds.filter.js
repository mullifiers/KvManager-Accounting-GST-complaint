(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('filterByIds', filterBy_Ids)
        .filter('filterBy_Ids', filterBy_Ids)
        
    /** @ngInject */
    function filterBy_Ids()
    {
        return function (items, _ids)
        {

            if ( items.length === 0 || !_ids )
            {
                return items;
            }

            if ( _ids.length === 0 )
            {
                return [];
            }

            var filtered = [];

            for ( var i = 0; i < items.length; i++ )
            {
                var item = items[i];
                var match = false;

                for ( var j = 0; j < _ids.length; j++ )
                {
                    var _id = _ids[j];
                    if ( item._id === _id )
                    {
                        match = true;
                        break;
                    }
                }

                if ( match )
                {
                    filtered.push(item);
                }

            }

            return filtered;

        };
    }

    function filterByIds()
    {
        return function (items, ids)
        {

            if ( items.length === 0 || !ids )
            {
                return items;
            }

            if ( ids.length === 0 )
            {
                return [];
            }

            var filtered = [];

            for ( var i = 0; i < items.length; i++ )
            {
                var item = items[i];
                var match = false;

                for ( var j = 0; j < ids.length; j++ )
                {
                    var id = ids[j];
                    if ( item.id === id )
                    {
                        match = true;
                        break;
                    }
                }

                if ( match )
                {
                    filtered.push(item);
                }

            }

            return filtered;

        };
    }

})();