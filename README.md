## lnm(Listing Node Modules)

listing node modules from the scripts in no package.json project

## usage

    $ git clone https://github.com/nbqx/lnm.git
    $ cd lnm
    $ npm install -g . # => or npm link .

then

    $ lnm index.js

or

    $ lnm "test/fixtures/*.js"

output

    yargs
    glob
    falafel
    resolve
    lodash

