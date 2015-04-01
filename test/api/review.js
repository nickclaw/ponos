var jobs = require('../fixtures/jobs'),
    applications = require('../fixtures/applications');

var goodReview = {
    comment: "hello world",
    a: 5,
    b: 4,
    c: 3
};

var badReview = {

};

module.exports = describe('review endpoint', function() {

    describe('POST /api/user/:id/review?application=:app - review', function() {

        before(function() {
            return Promise.all([
                db.Job.create(jobs),
                db.Application.create(applications)
            ]);
        });

        after(function() {
            return Promise.all([
                db.Job.remove({}).exec(),
                db.Application.remove({}).exec()
            ]);
        });

        it('should return 401 if not logged in', function() {
            r.login(U.anon);
            return r.post('/api/user/' + U.worker._id + '/review', goodReview).should.be.rejected
                .then(r.hasStatus(401))
                .then(r.logout);
        });

        it('should return 404 if no application is provided', function() {
            r.login(U.employer);
            return r.post('/api/user/' + U.worker._id + '/review', goodReview).should.be.rejected
                .then(r.hasStatus(404))
                .then(r.logout);
        });

        it('should return 404 if an unknown application is provided', function() {
            r.login(U.employer);
            return r.post('/api/user/' + U.worker._id + '/review?application=helloworld', goodReview).should.be.rejected
                .then(r.hasStatus(404))
                .then(r.logout);
        });

        it('should return 403 if an employer tries to review another employer', function() {
            r.login(U.employer);
            return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 403 if a worker tries to review another worker', function() {
            r.login(U.worker);
            return r.post('/api/user/' + U.worker._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 403 if a worker tries to review an unrelated employer', function() {
            r.login(U.worker);
            return r.post('/api/user/' + U.user._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        it('should return 403 if an employer tries to review an unrelated worker', function() {
            r.login(U.employer);
            return r.post('/api/user/' + U.user._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                .then(r.hasStatus(403))
                .then(r.logout);
        });

        describe('before job, unaccepted', function() {

            it('should return 403 if a worker tries to review an employer', function() {
                r.login(U.worker);
                return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });

            it('should return 403 if an employer tries to review a worker', function() {
                r.login(U.employer);
                return r.post('/api/user/' + U.worker._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });
        });

        describe('before job, accepted', function() {

            before(function() {
                return db.Application.findByIdAndUpdate('iamanapplication', {$set: {state: 'accepted'}}).exec();
            });

            it('should return 403 if a worker tries to review an employer', function() {
                r.login(U.worker);
                return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });

            it('should return 403 if an employer tries to review a worker ', function() {
                r.login(U.employer);
                return r.post('/api/user/' + U.worker._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });
        });

        describe('after job, unaccepted', function() {

            before(function() {
                return Promise.all([
                    db.Application.findByIdAndUpdate('iamanapplication', {$set: {state: 'rejected'}}).exec(),
                    db.Job.findByIdAndUpdate('iamajob', {$set: {end: new Date()}}).exec()
                ]);
            });

            it('should return 403 if a worker tries to review an employer', function() {
                r.login(U.worker);
                return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });

            it('should return 403 if an employer tries to review a worker', function() {
                r.login(U.employer);
                return r.post('/api/user/' + U.worker._id + '/review?application=iamanapplication', goodReview).should.be.rejected
                    .then(r.hasStatus(403))
                    .then(r.logout);
            });
        });

        describe('after job, accepted', function() {

            before(function() {
                return db.Application.findByIdAndUpdate('iamanapplication', {$set: {state: 'accepted'}}).exec();
            });

            before(function() {
                return Promise.all([
                    db.Job.findByIdAndUpdate('iamajob', {$set: {end: new Date()}}).exec(),
                    db.Application.findByIdAndUpdate('iamanapplication', {$set: {state: 'accepted'}}).exec()
                ]);
            });

            it('should return 400 if a worker provides invalid data', function() {
                r.login(U.user);
                return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', badReview).should.be.rejected
                    .then(r.hasStatus(400))
                    .then(r.logout);
            });

            it('should return 400 if an employer provides invalid data', function() {
                r.login(U.employer);
                return r.post('/api/user/' + U.user._id + '/review?application=iamanapplication', badReview).should.be.rejected
                    .then(r.hasStatus(400))
                    .then(r.logout);
            });

            it('should let the employer review the worker', function() {
                r.login(U.employer);
                return r.post('/api/user/' + U.user._id + '/review?application=iamanapplication', goodReview).catch(console.log).should.be.fulfilled
                    .then(r.logout);
            });

            it('should let the worker review the employer', function() {
                r.login(U.user);
                return r.post('/api/user/' + U.employer._id + '/review?application=iamanapplication', goodReview).catch(console.log).should.be.fulfilled
                    .then(r.logout);
            });
        });
    });

    describe('GET /api/user/:id/review', function() {

    });

});
