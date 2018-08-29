(function ()
{
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService)
        
    //var db=
    //var os=require('os');
    //var path=require('path');

    function apiService($http,$state)
    {
        
        var electron=require('electron');
        var dbaccess=electron.remote.require('./config/dbaccess.js')
        var dbcollections=electron.remote.require('./config/dbcollections.js')
        var fs=electron.remote.require('fs')
        var path=electron.remote.require('path')
        var api={
            db              :   dbaccess.Datastore,
            load            :   loadList,
            delete          :   deleteList,
            listfiles       :   {}
        };


        init();
        function init(){
            console.log('name')
            api['config']=dbaccess.Datastore('configuration/config');
            console.log('name')
            var inv=[
                'purchase',
                'sale',
                'dnote',
                'cnote'
            ];
            
            inv.forEach(function(name){
                console.log('name')
                api.config.insert({_id:name,current:0},function(err){
                console.log(err)
                })
            });
        }
       //var dbFolder='documents/KvDatabase/';
       //var name='contacts';
       //var nedb=new Nedb({filename: /*path.join(os.homedir(),'documents','kvdb','modules',*/(name+'.db'), autoload: true}    );
        
        
        dbcollections.list.forEach(function(dbname){
            api[dbname]=dbaccess.Datastore(dbname);
        })
  
        loadList();

        function loadList(cb){
            var newlist={}
             api.ratelists.find({},{_id:1},function(err,data){
                    data.forEach(function(d){
                        console.log(d._id)
                        newlist[d._id]=dbaccess.Datastore('listfiles/list-'+d._id)
                    })
                    api.listfiles=newlist;
                    
                    if(cb)cb();    
            })
            
        }
        
        function deleteList(_id){
            fs.unlinkSync(path.join(dbaccess.dbFolder,'modules','listfiles','list-'+_id+'.db'))
        }
        
        console.log(api);
        return api;
    }

})();