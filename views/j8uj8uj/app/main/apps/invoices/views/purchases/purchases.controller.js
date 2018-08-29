(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('PurchasesController', PurchasesController);

    /** @ngInject */
    function PurchasesController($state,invoiceService,$mdDialog, api,Statuses, Purchases,msApi)
    {
        var vm = this;

        // Data
        vm.purchaseFreeze=invoiceService.freeze('P');
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
            $state.go('app.invoices.add_purchase'); 
        }
        

        vm.purchases = (Purchases);
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

                                var purchaseStatus = vm.getPurchaseStatus(parseInt(data[0].id));
                                //console.log(purchaseStatus);
                                return '<span class="status ' + purchaseStatus.color + '">' + purchaseStatus.name + '</span>';
                            }
                            
                        }

                        if ( type === 'filter' )
                        {
                            if(data.length==0){
                                return 'No Status'
                            }
                            else{
                                return vm.getPurchaseStatus(parseInt(data[0].id)).name;
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
        vm.getPurchaseStatus = getPurchaseStatus;
        vm.gotoPurchaseDetail = gotoPurchaseDetail;

        //////////

        /**
         * Get purchase status
         *
         * @param id
         * @returns {*}
         */
        function getPurchaseStatus(id)
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
        function gotoPurchaseDetail(id)
        {
            $state.go('app.invoices.purchases.detail', {id: id});
        }
    }
})();