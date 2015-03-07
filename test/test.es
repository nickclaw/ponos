before(function() {

});

describe('the API', function() {

    before(function() {
        this.timeout(7500);
        return require('../server/server');
    });

    require('./api/placeholder');

    after(function() {
        // drop database?
    });
})

describe('the database', function() {
    require('./database/placeholder');
})

after(function() {

});
