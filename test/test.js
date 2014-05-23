var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;
var test = require('tape');
var lnm = require('..');

test('module test',function(t){
  var f = [__dirname,'fixtures','index.js'].join('/');
  var res = { 
    fs: 'fs',
    path: 'path',
    yargs: path.resolve(__dirname+'/../','node_modules/yargs/index.js'),
    glob: path.resolve(__dirname+'/../','node_modules/glob/glob.js'),
    falafel: path.resolve(__dirname+'/../','node_modules/falafel/index.js'),
    resolve: path.resolve(__dirname+'/../','node_modules/resolve/index.js'),
    lodash: path.resolve(__dirname+'/../','node_modules/lodash/dist/lodash.js')
  };
  t.deepEqual(lnm(f),res,'should be equivalent');
  t.end();
});

test('cli test',function(t){
  var res = fs.readFileSync(__dirname+'/fixtures/result.txt')+'';
  exec('node '+__dirname+'/../bin/cmd.js '+__dirname+'/fixtures/index.js',function(err,stdout,stderr){
    t.notOk(err,'no error');
    t.equal(stderr,'','stderr is empty');
    t.equal(stdout,res,'stdout');
    t.end();
  });
});
