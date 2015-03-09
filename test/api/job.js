var stub = require('passport-stub'),
    jobs = require('../fixtures/jobs'),
    users = require('../fixtures/users');

describe('job endpoint', function() {

    // fixtures
    beforeEach(function() {
        this.timeout(5000);
        return Promise.all([
            db.User.create(users),
            db.Job.create(jobs)
        ]);
    });

    afterEach(function() {
        return Promise.all([
            db.Job.remove({}).exec(),
            db.User.remove({}).exec()
        ]);
    });

    describe('POST /api/job - create', function() {

        var user = users[0],
            data = {
                "poster": "asdfsafasfd",
                "title": "Lawnmowing",
                "location": {
                    "lat": 45.32,
                    "long": 50.75
                },
                "start": 123432424,
                "end": 13234224,
                "description": "Mow my lawn pleeeeease.",
                "needed": 1,
                "rate": 20,

                "equipmentProvided": "Lawnmower",
                "applications": ['hiiii'],
                "not_a_property": "sup"
            },
            badData = {

            },
            ret = null;

        it('should return 403 if not logged in', function() {
            return r
                .post('/api/job', data).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 401 if invalid data', function() {
            stub.login(user);
            return r
                .post('/api/job', badData).should.be.rejected
                .then(r.hasStatus(401))
                .then(function() {
                    stub.logout();
                });
        });

        it('should create a job', function() {
            stub.login(user);
            return r
                .post('/api/job', data).should.be.fulfilled
                .then(function(j) {
                    ret = j;
                    stub.logout();
                })
        });

        it('should only allow settable properties to be set', function() {
            expect(ret.not_a_property).to.be.undefined;
            expect(ret.poster).to.equal(user._id);
            expect(ret.rate).to.equal(data.rate);
        });

    });

    describe('GET /api/job/:id - retrieve', function() {

        var job = jobs[0];

        it('should retrieve the requested job', function() {
            return r
                .get('/api/job/' + job._id).should.be.fulfilled
                .then(function(j) {
                    expect(j).to.shallowDeepEqual(job);
                })
        });

        it('should return 404 if a non existent job is created', function() {
            return r
                .get('/api/job/' + 'adfsafsfas').should.be.rejected
                .then(r.hasStatus(404));
        })

    });

    describe('POST /api/job/:id - update', function() {

        var job = jobs[0],
            user = users[0],
            data = {
                title: "Extreme Lawnmowing",
                start: "2015-02-09T02:24:42.216Z"
            },
            badData = {
                title: "",
                location: {
                    long: Math.Infinity
                }
            },
            ret = null;

        it('should return 403 if user isnt authorized', function() {
            return r
                .post('/api/job/' + job._id, data).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 404 if a non existent job is updated', function() {
            return r
                .post('/api/job/' + 'adfsafsfas', data).should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should return 401 if invalid data', function() {
            stub.login(user);
            return r
                .post('/api/job/' + job._id, badData).should.be.rejected
                .then(r.hasStatus(401))
                .then(function() {
                    stub.logout();
                })
        });

        it('should update the job', function() {
            stub.login(user);
            return r
                .post('/api/job/' + job._id, data).should.be.fulfilled
                .then(function(j) {
                    ret = j;
                    stub.logout();
                });
        });

        it('should only update editable data', function() {
            expect(ret.title).to.equal(data.title);
            expect(ret.start).to.equal(job.start);
        });
    });

    describe('DELETE /api/job/:id - delete', function() {

        var job = jobs[0],
            user = users[0];

        it('should return 403 if user isnt authorized', function() {
            return r
                .del('/api/job/' + job._id).should.be.rejected
                .then(r.hasStatus(403));
        });

        it('should return 404 if a non existent job is deleted (IS THIS THE RIGHT BEHAVIOR?)', function() {
            return r
                .del('/api/job/' + 'adfsafsfas').should.be.rejected
                .then(r.hasStatus(404));
        });

        it('should delete the job', function() {
            stub.login(user);
            return r
                .del('/api/job/' + job._id).should.be.fulfilled
                .then(function(j) {
                    stub.logout();
                    expect(j).to.shallowDeepEqual(job);
                })
        });
    });

});
