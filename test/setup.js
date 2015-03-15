var chai = require('chai'),
    stub = require('passport-stub'),
    shallowEqual = require('chai-shallow-deep-equal'),
    asPromised = require('chai-as-promised'),
    request = require('superagent');

// add globals: Log, C, Promise
require('../config/config');

chai.should();
chai.use(asPromised);
chai.use(shallowEqual);

// expose expect for nice looking tests
global.expect = chai.expect;
global.U = {
    anon: true
};

//
// Expose request shortcuts
//
global.r = {
    get: function get(url) {
        return new Promise(function(res, rej) {
            request
                .get(C.SERVER.HOST + ':' + C.SERVER.PORT + url)
                .end(handle(res, rej));
        });
    },

    post: function post(url, data) {
        return new Promise(function(res, rej) {
            request
                .post(C.SERVER.HOST + ':' + C.SERVER.PORT + url)
                .send(data)
                .end(handle(res, rej));
        });
    },

    del: function del(url) {
        return new Promise(function(res, rej) {
            request
                .del(C.SERVER.HOST + ':' + C.SERVER.PORT + url)
                .end(handle(res, rej));
        });
    },

    hasStatus: function(code) {
        return function(res) {
            expect(res.status).to.equal(code);
            return res;
        }
    },

    login: function(user) {
        stub.login(user);
    },

    logout: function(val) {
        stub.logout();
        return val;
    }
}

function handle(res, rej) {
    return function handle(e, r) {
        if (e) {
            rej(e);
        } else if (r.status !== 200 && r.status !== 201) {
            rej(r);
        } else {
            res(r.body);
        }
    }

}
