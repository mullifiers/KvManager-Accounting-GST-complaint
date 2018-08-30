(function ()
{
    'use strict';

    angular
        .module('config.port',[])
        .provider('port',portprovider)
        
    function portprovider()
    {
        var vm={};
        var set=false;
        // function init(){
        
        // //------------------------------ Feathers port Request ------------------------//
        // var electron=require('electron')
        // const remote=electron.remote;
        // const ipcRenderer =electron.ipcRenderer;
        //         ipcRenderer.send('selectPort');
        //         ipcRenderer.on('portSelected', function(event,arg){
        //               vm['value']=arg;
        //               set=true;
                      
        //         });
        // //------------------------------ Feathers port Request ------------------------//
    
        
        // }
    
    this.$get=function(){
        
        if(vm.set==true)
        return 'asdf';
        else
        return {value:3050};

    }
        
    }

})();