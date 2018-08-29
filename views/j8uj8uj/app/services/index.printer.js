(function ()
{
    'use strict';

    angular
        .module('printer',[])
        .service('Printer',printerService)
        
    function printerService()
    {
        var vm=this
        
        
            //------------------------------ electron Remote --------------------//   
            var remote=require('electron').remote
            var fs=require('fs')
            //-------------------------------------------------------------------//
     
        
        vm.printWeb=function(invoice){   
                var worker=new remote.BrowserWindow({show:false});
                var file = 'data:text/html;charset=UTF-8,' + encodeURIComponent('<!doctype html><html><body>'+invoice+'</body></html>')
                
                worker.loadURL(file);
                worker.webContents.on('dom-ready',function(){
                    //alert('asdf')
                worker.webContents.printToPDF({printBackground: true,pageSize:'A4',marginsType:2},function(err,data){
                    //console.log(data);
                
                    remote.dialog.showSaveDialog({defaultPath:'invoice'+'.pdf'},function(filename){//console.log('filename:'+data)
                        fs.writeFile(filename,data,function(err){
                            remote.shell.openItem(filename)
                        }) 
                        worker.destroy();  
                    });
                
                });

            });
        };
        
    }
})();