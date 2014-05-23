var fs = require('fs');
var path = require('path');

var argv = require('yargs').argv;
var glob = require('glob');
var falafel = require('falafel');
var resolve = require('resolve');
var _ = require('lodash');

module.exports = function(fp,cb){
  if(fs.statSync(fp).isDirectory()) return;

  var ret = {},
      dirname = path.dirname(fp),
      src = fs.readFileSync(fp)+'';
  
  try{
    falafel(src, function(node){
      // update from __dirname to absolute path
      if(node.type==='Identifier' && node.name==='__dirname'){
        node.update("'"+dirname+"'");
      }

      if(node.type==='CallExpression' && node.callee.name==='require'){
        if(node.arguments[0].value!==undefined){
          var k = node.arguments[0].value;
          var v = resolve.sync(k,{basedir: dirname});
          ret[k] = v;
        }else{
          var k = eval(node.arguments[0].source());
          var v = resolve.sync(k,{basedir: dirname});
          ret[k] = v;
        }
      }
    });

    return ret
  }catch(x_x){
    cb(x_x,fp);
  }
};

if(!module.parent){
  var res = [],
      show_head = false;

  var tgt = argv._[0];
  if(argv.h || argv.help || tgt===undefined){
    fs.createReadStream(__dirname+'/usage.txt').pipe(process.stdout);
    process.exit();
  }

  glob(tgt,function(err,files){

    var all = _.map(files,function(o){
      var f = path.resolve(process.cwd(),o);
      return module.exports(f,function(err,at){
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
