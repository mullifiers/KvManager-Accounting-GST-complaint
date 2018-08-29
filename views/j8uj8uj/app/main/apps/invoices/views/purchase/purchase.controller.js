(function ()
{
    'use strict';
    angular
        .module('app.invoices')
        .controller('PurchaseController', PurchaseController);

    /** @ngInject */
    function PurchaseController(invoiceService,Purchase, $scope,$state,POS,Printer, Statuses,Products, Contacts,Ratelists ,uiGmapGoogleMapApi, api)
    {
        var vm = this;
        // Data 
        vm.prodQuantity=1;
        vm.prodDiscount=0;
           console.log(Purchase[0])
           
        vm.purchase = angular.copy( Purchase[0]);

      
        // var oldDate=vm.purchase.invDate;
        
        
         vm.purchase.invDate=new Date()
        vm.ratelists=Ratelists;
        
        vm.ratelistChange=function(){
            api.listfiles[vm.selectedList._id].find({},function(d,data){ vm.products=data; console.log(data)})
        }



        vm.freeze=invoiceService.freeze('P')

        vm.getBill=function(){
            return vm.purchase.total;
        }
       vm.savePurchase=function(){
            api.purchases.update({_id:vm.purchase._id},JSON.parse(angular.toJson(vm.purchase)),function(d){console.log(d)
               $state.go('app.invoices.purchases',{},{reload:'app.invoices.purchases'})

            })
        }
        
        vm.toWords=function(){return invoiceService.inWords(Math.trunc(vm.purchase.total))};
        vm.getPOS=function(){
            var d=( vm.purchase['shipping'] )
            if(d)
                if(d.state)
                return  JSON.parse(d.state).cd +' - '+ (JSON.parse(d.state).nm) ;
            else
                return 'N.A.'
        }
        vm.getMap=function(){
            var geocoder=new google.maps.Geocoder();
            geocoder.geocode({'address':vm.purchase.shipping.address},function(results){
                   
            
            var loc=results[0].geometry.location;
             console.log(loc.lat())
            vm.shipping.addressMap = {
                center: {
                    latitude:loc.lat(),
                    longitude:loc.lng()
                },
                marker: {
                    id: 'shippingAddress',
                    position:  {
                        latitude:loc.lat(),
                        longitude:loc.lng()
                    }
                },
                zoom  : 8
            };


            });
        }
        vm.autocompleteChange=function(){
            if(!vm.purchase.customer)
                return;
            vm.purchase.shipping=angular.copy(vm.purchase.customer);
            vm.getMap();

        };
        $scope.$watch(function(){if(typeof google=='undefined')return 'e'; else return 'ne' },
        function(){
            vm.getMap();
        })
        vm.print=function(){
            Printer.printWeb((document.getElementsByClassName('invoice-container')[0].innerHTML))
        };
        vm.newStatus={date:new Date()};
        vm.states=POS;


        vm.getGst=function(){
            var d=( vm.purchase['shipping'] )
            if(d)
                if(d.state)
            {
                if(JSON.parse(d.state).cd=='06')
                return {i:0,s:14,c:14}
            else
                return {i:28,s:0,c:0}}
            return {i:'N.A.',s:'N.A.',c:'N.A.'}

        }


        vm.getTaxableTotal=function(){
            var s=0;
            vm.purchase.products.forEach(function(d){
                s+=d.priceTaxExcl*d.quantity*(1-d.discount/100);
            });
        
            var a=vm.getGst();
            vm.purchase.payable={
                sgst:s*(a.s/100),
                cgst:s*(a.c/100),
                igst:s*(a.i/100),
            }
            vm.purchase.total=  s+
                                vm.purchase.payable.sgst+
                                vm.purchase.payable.cgst+
                                vm.purchase.payable.igst;
            return s;
        }


        vm.getTotal=function(){
            var s=0;
            vm.purchase.products.forEach(function(d){
            s+=d.priceTaxExcl*d.quantity;
            });
            return s;
        }
         vm.removeProduct=function(index){
            vm.purchase.products.splice(index,1)
        }
        vm.addProduct=function(){
            var a;
            if((a=vm.purchase.products.indexOf(vm.selectedProduct))!=-1)
            {
                //alert(vm.purchase.products[a].quantity);
                vm.purchase.products[a].quantity+=vm.prodQuantity;
            }
            else{
                
                vm.selectedProduct.quantity=vm.prodQuantity;
                console.log(vm.prodDiscount)
                vm.selectedProduct.discount=vm.prodDiscount;
                console.log(vm.selectedProduct)
                vm.purchase.products.push(vm.selectedProduct);
               
            }
        };
        //vm.purchase.products
        vm.delProduct=function(i){
            vm.purchase.products.splice(i);
        }
   
        vm.customers = Contacts;
        vm.products = Products;
        

           
        vm.statuses = Statuses.data;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [
               {
                    // Target the image column
                    targets   : 0,
                    width     : '10%'
                },
                {
                    // Target the image column
                    targets   : 1,
                    filterable: false,
                    sortable  : false,
                    width     : '10%'
                },
                 {
                    // Target the image column
                    targets   : 2,
                    width     : '40%'
                },
                {
                    // Target the image column
                    targets   : 3,
                    width     : '10%'
                },
                {
                    // Target the image column
                    targets   : 4,
                    width     : '10%'
                },
                {
                    // Target the image column
                    
                    targets   : 5,
                    width     : '10%'
                },
                {
                    // Target the image column
                    targets   : 6,
                    width     : '10%',
                    
                },
                {
                    // Target the actions column
                    targets           : 7,
                    width     : '10%',
                    filterable        : false,
                    sortable          : false
                },
                
            ],
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 4,
            responsive: false
        };

        vm.newStatus = '';

        // Methods
        vm.gotoPurchases = gotoPurchases;
        vm.gotoProductDetail = gotoProductDetail;
        vm.updateStatus = updateStatus;

        //////////

        // Normally, you would need Google Maps Geocoding API
        // to convert addresses into latitude and longitude
        // but because Google's policies, we are faking it for
        // the demo
        vm.shipping={
                addressMap:{
                center: {
                    latitude : -34.397,
                    longitude: 150.644
                },
                marker: {
                    id: 'shippingAddress',
                    position:  {
                        latitude : -34.397,
                        longitude: 150.644
                    }
                },
                zoom  : 8}
        }
        uiGmapGoogleMapApi.then(function (maps)
        {
            vm.invoiceAddressMap = {
               
            };

        });

        /**
         * Initialize
         */
        /**
         * Go to purchases page
         */
        function gotoPurchases()
        {
            $state.go('app.invoices.purchases');
        }

        /**
         * Go to product page
         * @param id
         */
        function gotoProductDetail(id)
        {
            $state.go('app.invoices.products.detail', {id: id});
        }

        /**
         * Update purchase status
         *
         * @param id
         */
        function updateStatus(s)
        {
            if ( !s.id )
            {
                return;
            }

            for ( var i = 0; i < vm.statuses.length; i++ )
            {
                if ( vm.statuses[i].id === parseInt(s.id) )
                {
                    vm.purchase.status.unshift({
                        id   : vm.statuses[i].id,
                        name : vm.statuses[i].name,
                        color: vm.statuses[i].color,
                        date : s.date
                    });

                    break;
                }
            }
            
        }
    }
})();