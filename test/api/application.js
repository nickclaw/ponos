var jobs = require('../fixtures/jobs');

describe('application endpoint', function() {

    beforeEach(function() {
        return db.Job.create(jobs);
    });

    afterEach(function() {
        return db.Job.remove().exec();
    });

    var id = jobs[0]._id;

    describe('POST /api/job/:id/application - applying', function() {

        var data = {blurb: "I would like to work here!"},
            badData = {};

        it('should return 401 for unauthenticated users', function() {
            return r.post('/api/job/' + id + '/application', data).should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 for non-worker users', function() {
            r.login(U.employer);
            return r.post('/api/job/' + id + '/application', data).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 400 for invalid application', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application', badData).should.be.rejected
                .then(r.hasStatus(400))
                .then(r.logout);
        });

        it('should create an application', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application', data).should.be.fulfilled
                .then(function(application) {

                })
                .then(r.logout);
        });

        it.skip('should return 403 when applying twice', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application', data).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

    });

    describe('GET /api/job/:id/application - viewing applications', function() {

        it('should return 401 for unauthenticated users', function() {

        });

        it('should return 403 for non-job owners', function() {

        });

        it('should be able to return all the applications', function() {

        });
    });

    describe('POST /api/job/:id/application/:id/withdraw - withdraw', function() {

        it('should return 401 for unauthenticated users', function() {

        });

        it('should return 403 for anyone but the application owner', function() {

        });

        it('should return 403 after the application has been accepted', function() {

        });

        it('should withdraw the application', function() {

        });

    });

    describe('POST /api/job/:id/application/:id/accept - accepting', function() {

        it('should return 401 for unauthenticated users', function() {

        });

        it('should return 403 for anyone but the job owner', function() {

        });

        it('should accept the application', function() {

        });

    });

    describe('POST /api/job/:id/application/:id/reject - rejecting', function() {

        it('should return 401 for unauthenticated users', function() {

        });

        it('should return 403 for anyone but the job owner', function() {

        });

        it('should reject the application', function() {

        });

    });
});
