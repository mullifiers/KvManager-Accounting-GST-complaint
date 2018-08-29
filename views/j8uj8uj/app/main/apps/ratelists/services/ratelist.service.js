(function ()
{
    'use strict';

    angular
        .module('ratelists.service',[])
        .service('RatelistServ',RatelistService)
        
    function RatelistService($mdDialog,api,$state)
    {
        var vm=this
        
        
            //------------------------ nodejs Dependencies --------------------//   
            
            var remote=require('electron').remote;
            var ipc=require('electron').ipcRenderer;
           
            //-----------------------------------------------------------------//
        vm.ratelist={}
        ipc.on('gotList',function(event,data){

                console.log(vm.parseList(data));
                var p={
                    name        :   vm.ratelist.name,
                    description :   vm.ratelist.description,
                    //data        :   vm.parseList(data)
                }
                console.log(p);
                api.ratelists.insert(p,function(err,d){
                    console.log(err);
                    console.log(d);
                    api.load(function(){
                        api.listfiles[d._id].insert(vm.parseList(data),function(err){
                            console.log(err);
                        })
                        console.log(api.listfiles)
                        $state.go('app.ratelists',{},{reload:'app.ratelists'})
                    });
                    
                    console.log('pulkit:    '+d._id)
                    
                })
                $mdDialog.hide();
                
            })

        vm.getList=function(ratelistDetails){ 
            vm.ratelist=ratelistDetails;  
            ipc.send('importRatelist');
        };

        vm.parseList=function(list){
            return list.map(function(i){
                return {
                    symb            :   i.ID,
                    class           :   i.class,
                    description     :   i.description,
                    hsn             :   parseInt(i.hsn,10),
                    measure         :   i.measure,
                    name            :   i.name,
                    packing         :   parseInt(i.packing,10),
                    priceTaxExcl    :   parseFloat(i.priceTaxExcl),
                    quantity        :   parseInt(i.quantity,10),
                    size            :   parseInt(i.size,10),
                    taxRate         :   parseInt(i.taxRate,10)
                }
            })    
        };
    }

})();