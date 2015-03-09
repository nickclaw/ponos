scaffold (actual name pending)
===========

### Requirements

* Node `v12.0.0+` or iojs `v1.4.3+`.
* `npm`, `bower`, and `grunt` installed globally.
* `bcrypt` installed.

### Setup

Install all third party packages with npm and bower.

```shell
npm install
bower install
# edit config files
npm test
```

A post-install script will copy the `config/default.json` to `config/{development,production,testing}.json`, this can be used to customize the application in different contexts. Set the `NODE_ENV` environent variable to choose which configuration file to use. The commands `npm start` and `grunt default` both set the `NODE_ENV` to `development`.

### Running

To run in development, call `grunt default` from the root of the project. Keep in mind that this will use the `config/development.json` file.

To run in production, call `grunt production` to build the production assets and use `NODE_ENV=production node index.js` to start the server. Although using an interface like `foreverjs` is recommended for a real production environment.

### Configuration

Taken from `config/default.json`. You will need to fill out config files for the `testing`, `development`, and `production` environments.

**Warning:** your test database will be reset after every time. Do not put a database name you care about into the `settings.json` config file.

```javascript
{
    "APP": {
        "MAX_CPUS": 4, // maximum number of clusters
        "REVIVE": true, // fork a new process after one exits
        "STDOUT": true, // log to stdout
        "LOGFILE": "output.log", // relative to project root, leave empty for no file logging
        "SEED": "veryrandomseed"
     },

    "SERVER": {
        "HOST": "127.0.0.1", // host name
        "PORT": 8080 // port to listen on

        // cookie settings
        "COOKIE": {
            "KEY": "key",
            "SECRET": "notasecret",
            "MAXAGE": 86400000
        }
    },

    "DATABASE": {

        // where to connect to
        "NAME": "database",
        "HOST": "localhost",
        "PORT": 9999,

        // authentication
        "USER": "username",
        "PASS": "password"
    },

    "AUTH": {
        "GOOGLE": {
            "ID": "",
            "SECRET": ""
        }
    }
}
```
