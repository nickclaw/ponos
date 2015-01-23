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

Copy the `config/default.json` file to have working values. By default `npm start` will tell the application to look for `config/development.json`, but you can point to any file by changing the `NODE_ENV` environment variable.

### Configuration

Taken from `config/default.json`, a lot more configuration options will be added soon.

```javascript

{
    "server": {
        "port": 8080 // port to listen on
    },

    "database": {

        // where to connect to
        "host": "localhost",
        "port": 9999,

        // database authentication
        "user": "root",
        "pass": "password123"
    }
}

```
