#!/usr/bin/env node
var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    _ = require('lodash'),
    argv = require('yargs').argv;

var lnm = require(__dirname+'/..');

var res = [];
var tgt = argv._[0];

if(argv.h || argv.help){
  fs.createReadStream(__dirname+'/usage.txt').pipe(process.stdout);
}
else if(tgt!==undefined){
  glob(tgt,function(err,files){

    var all = _.map(files,function(o){
      var f = path.resolve(process.cwd(),o);
      return lnm(f,function(err,at){
        console.log(err.toString());
        console.log(" => "+at);
      });
    });

    _.each(all,function(o){
      _.each(o,function(v,k){
        if(/node_modules/.test(v)){
          res.push(k);
        }
      });
    });

    console.log(_.uniq(res).join("\n"));
  });
}
else{
  fs.createReadStream(__dirname+'/usage.txt').pipe(process.stdout);
}
