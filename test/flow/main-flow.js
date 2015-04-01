var mongoose = require('mongoose'),
    stub = require('passport-stub'),
    users = require('../fixtures/users.json'),
    job = require('../fixtures/jobs.json')[0];

var worker, employer;

before(function() {

    return require('../../server/server')
        .then(function(results) {
            stub.install(results[1]);
            return Promise.all([
                createUser(users.worker),
                createUser(users.employer)
            ]);
        })
        .spread(function(w, e) {
            worker = w;
            employer = e;
        });
});

describe('main application flow', function() {

    var jobId, appId;

    it('should be possible for the employer to create a job', function() {
        r.login(employer);
        return r.post('/api/job', job).should.be.fulfilled
            .then(function(job) {
                jobId = job._id;
                expect(job.poster).to.equal(employer._id);
            })
            .then(r.logout);
    });

    it('should be possible for the worker to browse for that job', function() {
        r.login(worker);
        return r.get('/api/job').should.be.fulfilled
            .then(function(jobs) {
                expect(jobs.length).to.equal(1);
                expect(jobs[0]._id).to.equal(jobId);
            })
            .then(r.logout);
    });

    it('should be possible for the worker to apply for that job', function() {
        r.login(worker);

        var data = {blurb: "I would like to work here."};

        return r.post('/api/job/' + jobId + '/application', data).should.be.fulfilled
            .then(function(application) {
                appId = application._id;
                expect(application.applicant).to.equal(worker._id);
                expect(application.owner).to.equal(employer._id);
                expect(application.job).to.equal(jobId);
            })
            .then(r.logout);
    });

    it('should be impossible for the worker to accept the application', function() {
        r.login(worker);
        return r.post('/api/job/' + jobId + '/application/accept').should.be.rejected
            .then(r.logout);
    });

    it.skip('should give the employer a notification', function() {

    });

    it.skip('should be possible for the employer to see the application from all jobs', function() {

    });

    it('should be possible to for the employer to view job applications', function() {
        r.login(employer);
        return r.get('/api/job/' + jobId + '/application').should.be.fulfilled
            .then(function(applications) {
                expect(applications).to.have.keys('pending', 'accepted', 'waiting', 'rejected');
                expect(applications.pending.length).to.equal(1);
                expect(applications.pending[0]._id).to.equal(appId);
                expect(applications.pending[0].applicant._id).to.equal(worker._id);
                expect(applications.pending[0].owner).to.equal(employer._id);
            })
            .then(r.logout);
    });

    it('should be possible for the employer to accept the job application', function() {
        r.login(employer);
        return r.post('/api/job/' + jobId + '/application/accept').should.be.fulfilled
            .then(r.logout);
    });

    it.skip('should give the worker a notification', function() {

    });

    it('should be possible for the worker to now accept the job application', function() {
        r.login(worker);
        return r.post('/api/job/' + jobId + '/application/accept').should.be.fulfilled
            .then(r.logout);
    });

    it.skip('should give the employer a notification', function() {

    });

    it('should now be impossible for the worker to withdraw their application', function() {
        r.login(worker);
        return r.post('/api/job/' + jobId + '/application/withdraw').should.be.rejected
            .then(r.logout);
    });

    it('should now be impossible for the employer to reject the application', function() {
        r.login(employer);
        return r.post('/api/job/' + jobId + '/application/reject').should.be.rejected
            .then(r.logout);
    });

    var reviewData = {
        comment: "This is a comment.",
        a: 5,
        b: 4,
        c: 3
    };

    it('should be impossible for the employer to review the worker before the date has passed', function() {
        r.login(employer);
        return r.post('/api/user/' + worker._id + '/review?application=' + appId, reviewData).should.be.rejected
            .then(r.logout);
    });

    it('should be impossible for the worker to review the employer before the date has passed', function() {
        r.login(worker);
        return r.post('/api/user/' + employer._id + '/review?application=' + appId, reviewData).should.be.rejected
            .then(r.logout);
    });

    it('', function() {
        return db.Job.findByIdAndUpdate(jobId, {$set: {end: new Date()}}).exec();
    });

    it('should now be possible for the worker to review the employer', function() {
        r.login(worker);
        return r.post('/api/user/' + employer._id + '/review?application=' + appId, reviewData).should.be.fulfilled
            .then(r.logout);
    });

    it('should now be possible for the employer to review the worker', function() {
        r.login(employer);
        return r.post('/api/user/' + worker._id + '/review?application=' + appId, reviewData).should.be.fulfilled
            .then(r.logout);
    });

    it('should be impossible for the employer to review the worker again', function() {
        r.login(employer);
        return r.post('/api/user/' + worker._id + '/review?application=' + appId, reviewData).should.be.rejected
            .then(r.logout);
    });

    it('should be impossible for the worker to review the employer again', function() {
        r.login(worker);
        return r.post('/api/user/' + employer._id + '/review?application=' + appId, reviewData).should.be.rejected
            .then(r.logout);
    });

});


after(function() {
    stub.uninstall();
    return Promise.all([
        db.User.remove({}).exec(),
        db.Job.remove({}).exec(),
        db.Application.remove({}).exec()
    ]);
});


function createUser(user) {
    user = new db.User(user);
    return Promise.try(user.save, [], user)
        .then(function() {
            return user;
        });
}
