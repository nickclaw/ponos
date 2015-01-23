ponos (actual name pending)
===========

### Requirements

* Node `v0.10.33` or higher
* `npm`, `bower`, and `grunt` installed globally
* Probably `bcrypt` at some point

### Setup

Install all third party packages with npm and bower.

    npm install
    bower install

A post-install script will copy the `config/default.json` to `config/{development,production,testing}.json`, this can be used to customize the application in different contexts. Set the `NODE_ENV` environent variable to choose which configuration file to use. The commands `npm start` and `grunt default` both set the `NODE_ENV` to `development`.

### Configuration

Taken from `config/default.json`, a lot more configuration options will be added soon.

```javascript

{
    "APP": {
        "MAX_CPUS": 4, // maximum number of clusters
        "REVIVE": true // fork a new process after one exits
    },

    "SERVER": {
        "PORT": 8080 // port to listen on
    },

    "DATABASE": {

        // where to connect to
        "HOST": "localhost",
        "PORT": 9999,

        // authentication
        "USER": "root",
        "PASS": "password123"
    }
}

```
