(function ()
{
    'use strict';

    angular
        .module('invoicing',[])
        .service('invoiceService', invservice)
    
    function invservice(api,$mdDialog,$state)
    {
        var vm=this;
        console.log('peropona#$#@');
        vm.short=function(id){
            if(id=='P')
            return 'purchase'
            if(id=='S')
            return 'sale'
            if(id=='CN')  
            return 'credit_note'
            if(id=='DB')
            return 'debit_note'
        }
        vm.freeze=function(id){ 
            return function (_id,ev){
            
            var confirm = $mdDialog.confirm()
                            .title('Freeze '+ 'this Draft '+vm.short(id)+' Permanently? ')
                            .ariaLabel('freeze this invoice')
                            .targetEvent(ev)
                            .ok('Confirm')
                            .cancel('Cancel');
                            
            $mdDialog.show(confirm).then(function() {

                var name=vm.short(id);
                
                vm.generateID(name,function(current){
                    console.log(current);
                    var tstring = 'KVINV-P-'+current
                    api.purchases.update({_id:_id},{$set:{freezed:true,invID:tstring}},function(err,d){
                        console.log(err);
                        $state.go('app.invoices.'+name+'s',{},{reload:'app.invoices.'+name+'s'})
                    });   
                })
                
            }, function() {});
           
        }
        }
        
        vm.generateID=function(name,cb){
            
            api.config.find({_id : name},function(err,d){ 
                var curr=d[0].current;
                console.log('curr: '+curr)
                api.config.update({_id:name},{$set:{current:(curr+1)}},
                    function(){
                        cb(curr+1)
                })
                
            });
        }

        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
        vm.inWords= function(num) {
            
            if ((num = num.toString()).length > 9) return 'overflow';
            var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return; var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
            
            return str;
            
        }
    }
})();