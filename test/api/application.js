var jobs = require('../fixtures/jobs');

describe('application endpoint', function() {

    beforeEach(function() {
        return db.Job.create(jobs);
    });

    afterEach(function() {
        return db.Job.remove().exec();
    });


    describe('POST /api/job/:id/application - applying', function() {

        it('should return 401 for unauthenticated users', function() {

        });

        it('should return 403 for non-worker users', function() {

        });

        it('should return 400 for invalid application', function() {

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
