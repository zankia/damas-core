* in `/server-tests/` - tests of the REST API using http://jasmine.github.io/
* the tests are to be run on code from the same development branch (master, testing or experimental)
* `/server-nodejs/tests` - tests for the nodejs server using mocha

# Running tests
## Installation
### Mocha

To get started, you need to install some modules in server-nodejs :
```
npm install mocha chai chai-as-promised supertest
```

Once mocha is started, every time you save modifications in a file the server is using, tests are made automatically

### Jasmine

To get started, you need to install some modules in server-tests :
```
npm install
```

Edit `conf-tests-frisby.json` as you need

## Run

To run tests, simply type the following command in the appropriate directory :

```
npm test
```

If you have this error :

```
/usr/bin/env: node: No such file or directory
```
then modify the shebang of the command (node_modules/{moduleName}/bin/{moduleName}) to `#!/usr/bin/env `**`nodejs`** or create an alias `node` -> `nodejs`

#Tests results

Fun fact : Mocha did a really strange thing : it changes `'Foo'` into `{Foo:''}` when it is sent in POST

Anyway, the priority is now given to Jasmine/Frisby.

The latter is now testing Create, Read, Update, Delete, Graph, Lock, Unlock.

It revealed that:
* Read and Graph returns a non empty array, the parameter is not found.
* Read in POST needs an object which contains the key `id` as parameter
* Lock and Unlock make server crash if parameter is not found
* Delete doesn't throw the right errors