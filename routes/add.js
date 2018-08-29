////--------------- new patient record synthesis API ---------------////
var express = require('express');
var router = express.Router();
var path=require('path');
var fs = require('fs');
//------------------------------configuration--------------------------------//
var dbaccess=require('../config/dbaccess.js');
//---------------------------------------------------------------------------//




router.post('/add', function(req, res, next) {

  if(req.body.protocol){
  var db=dbaccess.Datastore(req.body.protocol);
    if(req.body.data){
      db.insert(req.body.data,
      function(err,doc){
        if(err)
        res.send(err);
        else
        res.send(doc);
      });
    }
    else{
      res.send('data field should not be null');
    }
  }
  else{
    res.send('there must be a protocol specifying collection');
  }

});

module.exports = router;
////-------------------------------------------------------------------////