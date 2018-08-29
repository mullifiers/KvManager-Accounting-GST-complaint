(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('ProductsController', ProductsController);

    /** @ngInject */
    function ProductsController($state,msApi,api, Products,Ratelists)
    {
        console.log('yppppi');

        var vm = this;
        vm.ratelists=(Ratelists);
        // Data
        
        vm.addNewProduct = addNewProduct;
        
        vm.products={}
        vm.ratelistChange=function(){
            api.listfiles[vm.selectedList._id].find({},function(d,data){ vm.products=data; console.log(data)})
            
        }
        function addNewProduct()
        {
            $state.go('app.invoices.add_product');  
        }
        vm.dtInstance = {};
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 0,
                    width  : '72px'
                },
                {
                    // Target the image column
                    targets   : 1,
                    filterable: false,
                    sortable  : false,
                    width     : '80px'
                },
                {
                    // Target the quantity column
                    targets: 5,
                    render : function (data, type)
                    {
                        if ( type === 'display' )
                        {   
                            if(parseInt(data) <= 0)
                            {
                                return '<div class="quantity-indicator md-red-500-bg"></div><div>' + 'None' + '</div>';
                            }
                            else if ( parseInt(data) <= 5 )
                            {
                                return '<div class="quantity-indicator md-red-500-bg"></div><div>' + data + '</div>';
                            }
                            else if ( parseInt(data) > 5 && parseInt(data) <= 25 )
                            {
                                return '<div class="quantity-indicator md-amber-500-bg"></div><div>' + data + '</div>';
                            }
                            else
                            {
                                return '<div class="quantity-indicator md-green-600-bg"></div><div>' + data + '</div>';
                            }
                        }

                        return data;
                    }
                },
                {
                    // Target the status column
                    targets   :7,
                    filterable: false,
                    render    : function (data, type)
                    {
                        if ( type === 'display' )
                        {
                            if (! data)
                            {
                                return '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
                            }

                            return '<i class="icon-cancel red-500-fg"></i>';
                        }

                        if ( type === 'filter' )
                        {
                            if ( data )
                            {
                                return '1';
                            }

                            return '0';
                        }

                        return data;
                    }
                },
                {
                    // Target the actions column
                    targets           : 8,
                    responsivePriority: 1,
                    filterable        : false,
                    sortable          : false
                }
            ],
            initComplete: function ()
            {
                var api = this.api(),
                    searchBox = angular.element('body').find('#invoices-products-search');

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    searchBox.on('keyup', function (event)
                    {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true
        };

        // Methods
        vm.gotoProductDetail = gotoProductDetail;
        

        /** 
         * @param id
         */
        function gotoProductDetail(pid)
        {
            console.log('hj'+pid);
            $state.go('app.invoices.products.detail', {rid: vm.selectedList._id,pid:pid});
        }
    }
})();