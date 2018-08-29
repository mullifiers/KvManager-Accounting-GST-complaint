(function ()
{
    'use strict';

    angular
        .module('app.invoices',
            [


                //Port module Dependency
                'config.port',
                // 3rd Party Dependencies
                'datatables',
                'flow',
                'nvd3',
                'textAngular',
                'uiGmapgoogle-maps',
                'xeditable',
                
            ]
        )
        .config(

    function($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        //portProvider.configure();
        //alert(JSON.stringify( portProvider.$get()))
        

        var aux={
            resolve  : {
                    Statuses    : function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    },
                    Products    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.products.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('hurrayy');
                                    resolve(d);
                                });
                        })
                    },
                    Contacts    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    POS         : function(msApi)
                    {
                        return msApi.resolve('pos-states@get')
                    }
        }
        }



        // State
        $stateProvider
            .state('app.invoices', {
                abstract: true,
                url     : '/invoices'
            })
            .state('app.invoices.summary', {
                url      : '/summary',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/summary/summary.html',
                        controller : 'summaryEcommerceController as vm'
                    }
                },
                resolve  : {
                    summary: function (msApi)
                    {
                        return {}//msApi.resolve('invoices.summary@get');
                    }
                },
                bodyClass: 'invoices'
            })
























//--------------------------------------------Products--------------------------------------//
            .state('app.invoices.products', {
                url      : '/products',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/products/products.html',
                        controller : 'ProductsController as vm'
                    }
                },
                resolve  : {
                    Products: function (api)
                    {
                        return new Promise(function(resolve){
                            //console.log('yppppi');
                                api.products.find({},function(err,d){
                                    console.log('yppppi');
                                    resolve(d);
                                });
                                
                        })
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('yppppi');
                                    resolve(d);
                                });
                        })
                    }
                },
                bodyClass: 'invoices'
            })
            .state('app.invoices.products.detail', {
                url      : '/ratelists/:rid/products/:pid',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/product/product.html',
                        controller : 'ProductController as vm'
                    }
                },
                resolve  : {
                    Product: function (api,$stateParams)
                    {
                        console.log('hello: '+$stateParams.rid)
                        
                        // return $stateParams.product;
                        
                        return new Promise(function(resolve){
                                api.load(function(){
                                    console.log(api.listfiles)
                                    api.listfiles[$stateParams.rid].find({_id:$stateParams.pid},function(err,d){
                                        
                                        console.log('oiuoiok')
                                        console.log(d);
                                        console.log(err);
                                    resolve(d);
                                    
                                    });
                                });
                                
                        })  
                    },
                    Categories:function(msApi){
                        return msApi.resolve('products.categories@get')
                    }
                },
                
                bodyClass: 'invoices',
            })
            .state('app.invoices.add_product', {
                url      : '/add_product',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/add.product/add.product.html',
                        controller : 'AddProductsController as vm'
                    }
                },
                resolve  : {
                    Categories:function(msApi){
                        return msApi.resolve('products.categories@get')
                    }
                },
                bodyClass: 'invoices'
            })
//--------------------------------------------Products--------------------------------------//




















//--------------------------------------------Purchases--------------------------------------//

            .state('app.invoices.purchases', {
                url      : '/purchases',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/purchases/purchases.html',
                        controller : 'PurchasesController as vm'
                    }
                },
                resolve  : {
                    Purchases  : function (api)
                    {
                        return new Promise(function(resolve){
                            api.purchases.find({},{

                                'customer.name' :1,
                                '_id'           :1,
                                'status'        :1,
                                'invDate'       :1,
                                'vehicle'       :1,
                                'shipping.state':1,
                                'total'         :1,
                                'freezed'       :1,
                                'invID'         :1

                            },function(err,d){
                                    resolve(d);
                                });
                        }) 
                    },
                    Statuses: function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    }
                },
                bodyClass: 'invoices'
            })
            .state('app.invoices.purchases.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/purchase/purchase.html',
                        controller : 'PurchaseController as vm'
                    }
                },
                resolve  : {
                    Purchase    : function (api,$stateParams)
                    {
                        return new Promise(function(resolve){
                                api.purchases.find({_id:$stateParams.id},function(err,d){
                                    resolve(d);
                                });
                        })                    
                    },
                    Statuses    : function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    },
                    Products    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.products.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('hurrayy');
                                    resolve(d);
                                });
                        })
                    },
                    Contacts    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    POS         : function(msApi)
                    {
                        return msApi.resolve('pos-states@get')
                    }
                },
                bodyClass: 'invoices'
            })
            .state('app.invoices.add_purchase', {
                url      : '/add_purchase',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/add.purchase/add.purchase.html',
                        controller : 'AddPurchaseController as vm'
                    }
                },
                resolve  : {
                    Statuses    : function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    },
                    Products    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.products.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('hurrayy');
                                    resolve(d);
                                });
                        })
                    },
                    Contacts    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    POS         : function(msApi)
                    {
                        return msApi.resolve('pos-states@get')
                    }

                },
                bodyClass: 'invoices'
            })

//--------------------------------------------Purchases--------------------------------------//


//--------------------------------------------Sales--------------------------------------//
           
            .state('app.invoices.sales', {
                url      : '/sales',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/sales/sales.html',
                        controller : 'SalesController as vm'
                    }
                },
                resolve  : {
                    Sales  : function (api)
                    {
                        return new Promise(function(resolve){
                            api.sales.find({},{

                                'customer.name' :1,
                                '_id'           :1,
                                'status'        :1,
                                'invDate'       :1,
                                'vehicle'       :1,
                                'shipping.state':1,
                                'total'         :1,
                                'freezed'       :1,
                                'invID'         :1

                            },function(err,d){
                                    resolve(d);
                                });
                        }) 
                    },
                    Statuses: function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    }
                },
                bodyClass: 'invoices'
            })
            .state('app.invoices.sales.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/sale/sale.html',
                        controller : 'SaleController as vm'
                    }
                },
                resolve  : {
                    Sale    : function (api,$stateParams)
                    {
                        return new Promise(function(resolve){
                                api.sales.find({_id:$stateParams.id},function(err,d){
                                    resolve(d);
                                });
                        })                    
                    },
                    Statuses    : function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    },
                    Products    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.products.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('hurrayy');
                                    resolve(d);
                                });
                        })
                    },
                    Contacts    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    POS         : function(msApi)
                    {
                        return msApi.resolve('pos-states@get')
                    }
                },
                bodyClass: 'invoices'
            })
            .state('app.invoices.add_sale', {
                url      : '/add_sale',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/invoices/views/add.sale/add.sale.html',
                        controller : 'AddSaleController as vm'
                    }
                },
                resolve  : {
                    Statuses    : function (msApi)
                    {
                        return msApi.resolve('invoices.statuses@get');
                    },
                    Products    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.products.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    Ratelists: function(api){
                        return new Promise(function(resolve){

                                api.ratelists.find({},function(err,d){
                                    console.log('hurrayy');
                                    resolve(d);
                                });
                        })
                    },
                    Contacts    : function (api)
                    {
                        return new Promise(function(resolve){
                                api.contacts.find({},function(err,d){
                                    resolve(d);
                                });
                        })  
                    },
                    POS         : function(msApi)
                    {
                        return msApi.resolve('pos-states@get')
                    }

                },
                bodyClass: 'invoices'
            })

//--------------------------------------------Sales--------------------------------------//



        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/invoices');













//===================================== Api Definations =====================================//
        msApiProvider.register('invoices.statuses', ['app/data/invoices/statuses.json']);      
        msApiProvider.register('pos-states', ['app/utility/states.json']);
        msApiProvider.register('products.categories', ['app/data/products/categories.json']);
//===================================== Api Definations =====================================//







        
        
        // Navigation
        msNavigationServiceProvider.saveItem('apps.invoices', {
            title : 'Invoices',
            icon  : 'icon-cart',
            weight: 3
        });

        msNavigationServiceProvider.saveItem('apps.invoices.summary', {
            title: 'Summary',
            state: 'app.invoices.summary'
        });

        msNavigationServiceProvider.saveItem('apps.invoices.products', {
            title: 'Products',
            state: 'app.invoices.products'
        });

        msNavigationServiceProvider.saveItem('apps.invoices.purchases', {
            title: 'Purchases',
            state: 'app.invoices.purchases'
        });
        msNavigationServiceProvider.saveItem('apps.invoices.sales', {
            title: 'Sales',
            state: 'app.invoices.sales'
        });
    }
    );
})();



        