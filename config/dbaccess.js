

//----------------------------------Database Startup config--------------------------------//
var Datastore = require('nedb'); 
var os= require('os');
var path=require('path');
var dbFolder='documents/KvDatabase/';


module.exports={ 
                dbFolder:path.join(os.homedir(),dbFolder),
                Datastore: function(name){return new Datastore(
                    {
                        filename: path.join(os.homedir(),dbFolder,'modules',name+'.db'),
                        autoload: true
                    })    
                }
            };

                
//----------------------------------Database Startup config--------------------------------//
