scaffold (actual name pending)
===========

### Requirements

* Node `v0.10.33` or higher
* `npm`, `bower`, and `grunt` installed globally
* Probably `bcrypt` at some point

### Setup

Install all third party packages with npm and bower.

```
npm install
bower install
# edit config files
```

A post-install script will copy the `config/default.json` to `config/{development,production,testing}.json`, this can be used to customize the application in different contexts. Set the `NODE_ENV` environent variable to choose which configuration file to use. The commands `npm start` and `grunt default` both set the `NODE_ENV` to `development`.

### Configuration

Taken from `config/default.json`, a lot more configuration options will be added soon.

```javascript
{
    "APP": {
        "MAX_CPUS": 4, // maximum number of clusters
        "REVIVE": true, // fork a new process after one exits
        "LOGFILE": "output.log" // relative to project root, leave empty for no file logging
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

### Running

To run in development, call `grunt default` from the root of the project. Keep in mind that this will use the `config/development.json` file.

To run in production, call `grunt production` to build the production assets and use `NODE_ENV=production node index.js` to start the server. Although using an interface like `foreverjs` is recommended for a real production environment.
