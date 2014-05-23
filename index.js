var fs = require('fs');
var path = require('path');
var falafel = require('falafel');
var resolve = require('resolve');

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
