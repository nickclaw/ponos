var jobs = require('../fixtures/jobs'),
    applications = require('../fixtures/applications');

describe('application endpoint', function() {

    beforeEach(function() {
        this.timeout(5000);
        return Promise.all([
            db.Job.create(jobs),
            db.Application.create(applications)
        ]);
    });

    afterEach(function() {
        return Promise.all([
            db.Job.remove().exec(),
            db.Application.remove().exec()
        ]);
    });

    var id = jobs[0]._id,
        appId = applications[0]._id;

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
            return r.get('/api/job/' + id + '/application').should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 for non-job owners', function() {
            r.login(U.user);
            return r.get('/api/job/' + id + '/application').should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it.skip('should be able to return all the applications', function() {
            r.login(U.employer);
            return r.get('/api/job/' + id + '/application').should.be.fulfilled
                .then(r.logout)
                .then(function(apps) {

                });
        });
    });

    describe('POST /api/job/:id/application/:id/withdraw - withdraw', function() {

        it('should return 401 for unauthenticated users', function() {
            return r.post('/api/job/' + id + '/application/' + appId + '/withdraw').should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 for anyone but the application owner', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application/' + appId + '/withdraw').should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 403 after the application has been accepted', function() {
            r.login(U.user);
            return db.Application.update({}, {state: 'accepted'}).exec()
                .then(function() {
                    return r.post('/api/job/' + id + '/application/' + appId + '/withdraw');
                }).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should withdraw the application', function() {
            r.login(U.user);
            return r.post('/api/job/' + id + '/application/' + appId + '/withdraw').should.be.fulfilled
                .then(r.logout);
        });

    });

    describe('POST /api/job/:id/application/:id/accept - accepting', function() {

        it('should return 401 for unauthenticated users', function() {
            return r.post('/api/job/' + id + '/application/' + appId + '/accept').should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 for anyone but the job owner', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application/' + appId + '/accept').should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        describe('as an employer', function() {

            it('should return 403 if not pending', function() {
                r.login(U.employer);
                return db.Application.update({}, {state: 'waiting'}).exec()
                    .then(function() {
                        return r.post('/api/job/' + id + '/application/' + appId + '/accept');
                    }).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });

            it('should accept the application', function() {
                r.login(U.employer);
                return r.post('/api/job/' + id + '/application/' + appId + '/accept').should.be.fulfilled
                    .then(r.logout);
            });
        });

        describe('as a worker', function() {

            it('should return 403 if not waiting', function() {
                r.login(U.user);
                return r.post('/api/job/' + id + '/application/' + appId + '/accept').should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });

            it('should accept the application', function() {
                r.login(U.user);
                return db.Application.update({}, {state: 'waiting'}).exec()
                    .then(function() {
                        return r.post('/api/job/' + id + '/application/' + appId + '/accept');
                    }).should.be.fulfilled
                    .then(r.logout);
            });
        });

    });

    describe('POST /api/job/:id/application/:id/reject - rejecting', function() {

        it('should return 401 for unauthenticated users', function() {
            return r.post('/api/job/' + id + '/application/' + appId + '/reject').should.be.rejected
                .then(r.hasStatus(401));
        });

        it('should return 403 for anyone but the job owner', function() {
            r.login(U.worker);
            return r.post('/api/job/' + id + '/application/' + appId + '/reject').should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 403 if accepted', function() {
            r.login(U.employer);
            return db.Application.update({}, {state: 'accepted'}).exec()
                .then(function() {
                    return r.post('/api/job/' + id + '/application/' + appId + '/reject');
                }).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should reject the application', function() {
            r.login(U.employer);
            return r.post('/api/job/' + id + '/application/' + appId + '/reject').should.be.fulfilled
                .then(r.logout);
        });
    });
});
