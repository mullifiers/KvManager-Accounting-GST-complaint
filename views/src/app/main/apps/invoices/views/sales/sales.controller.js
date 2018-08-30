(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('SalesController', SalesController);

    /** @ngInject */
    function SalesController($state,invoiceService,$mdDialog, api,Statuses, Sales,msApi)
    {
        var vm = this;

        // Data
        vm.saleFreeze=invoiceService.freeze('P');
        vm.getPOS=function(d){
            
            if(d&&d.state)
                return  (JSON.parse(d.state).nm) ;
            else
                return 'N.A.'
        }
        vm.addInvoice = addInvoice;
        //////////
        function addInvoice()
        {
            $state.go('app.invoices.add_sale');  
        }
        

        vm.sales = (Sales);
        vm.statuses = Statuses.data;
        
        //console.log(vm.statuses)
        vm.dtInstance = {};
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 1,
                    render : function (data)
                    {
                        if(data)
                        {
                            return '<span style="color: darkgreen">'+data+'<span>';
                        }
                        else{
                            return '<span style="color:rgb(170,170,170)'+'">'+'Draft'+'</span>'
                        }
                    }
                },
                {
                    // Target the status column
                    targets: 6,
                    render : function (dataStr, type)
                    {
                        var data=JSON.parse(dataStr);
                        if ( type === 'display' )
                        {
                            if(data.length==0){
                                return '<span class="status md-grey-300-bg' + '">' + ' No Status ' + '</span>';
                            }
                            else{

                                var saleStatus = vm.getSaleStatus(parseInt(data[0].id));
                                //console.log(saleStatus);
                                return '<span class="status ' + saleStatus.color + '">' + saleStatus.name + '</span>';
                            }
                            
                        }

                        if ( type === 'filter' )
                        {
                            if(data.length==0){
                                return 'No Status'
                            }
                            else{
                                return vm.getSaleStatus(parseInt(data[0].id)).name;
                            }
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
        vm.getSaleStatus = getSaleStatus;
        vm.gotoSaleDetail = gotoSaleDetail;

        //////////

        /**
         * Get sale status
         *
         * @param id
         * @returns {*}
         */
        function getSaleStatus(id)
        {
            for ( var i = 0; i < vm.statuses.length; i++ )
            {
                if ( vm.statuses[i].id === parseInt(id) )
                {
                    return vm.statuses[i];
                }
            }
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoSaleDetail(id)
        {
            $state.go('app.invoices.sales.detail', {id: id});
        }
    }
})();