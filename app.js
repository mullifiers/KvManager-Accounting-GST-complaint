var electron=require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;
const remote=electron.remote;
var path=require('path')
//---------------------------------------------------------------------------------------//




var serve=require('serve-static');
var _express=require('express');
var express=_express();
express.use(serve(path.join(__dirname,'views','dist')))
var listener=express.listen(0,onReady);




//---------------------------------------------------------------------------------------//


function onReady(){
app.on('ready', function() {
   var mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        icon:"icon.png",
        title:"KvFireworks Invoices",
        minHeight: 390,
        minWidth: 400,
        //show:false,
        // frame:false,
        thickFrame:true,
        fullscreenable:true,
        autoHideMenuBar:true,
        backgroundColor: '#3c4252',
        
        
    });
mainWindow.on( 'page-title-updated',function(event,title){event.preventDefault()});
mainWindow.on('ready-to-show',()=>{
    mainWindow.show();
})
//mainWindow.setMenu(null);
//mainWindow.loadURL('file://' + __dirname + '/views/dist/index.html');
mainWindow.loadURL('http://'+'localhost:'+listener.address().port);
    console.log(listener.address().port);   
    //mainWindow.loadURL('http://'+'localhost:'+3000);   
});





}




var filePath=require('./config/dbaccess.js').dbFolder;
console.log("Database-Path: "+(filePath));

//------------------------------------ RateList Import --------------------------------------//

var xlsx=require('xlsx')
var ipc = electron.ipcMain;
ipc.on('importRatelist',function(event){
        
    electron.dialog.showOpenDialog({buttonLabel:'Import List',  
                    filters:[{  name:'Excel RateList Template',
                                extensions:['xlsx','xls']
                            }]      
                    },function(filename){

                    console.log(filename[0]);
                    event.sender.send('gotList',parseSheet(filename[0]));

                });
});

var parseSheet=function(name){
    
    var list=xlsx.readFile(name);
    var sheet=list.Sheets[list.SheetNames[0]];
    return (xlsx.utils.sheet_to_json(sheet));
    
}


//------------------------------------ RateList Import --------------------------------------//