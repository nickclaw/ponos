
describe('user function', function() {

    var user;

    // create unfinished user
    describe('createUser', function() {
        this.timeout(5000);

        var input = {
            auth: {
                local: {
                    email: "user@example.com",
                    password: "password"
                }
            }
        };

        it('should create a new unfinished user', function() {
            return db.createUser(input).should.be.fulfilled
                .then((u) => user = u)
                .catch(function(e) {
                    console.log(e.actual.stack);
                });
        })
    });

    // complete user profile
    describe('updateUser', function() {
        var goodInput = {
            firstName: "Test",
            lastName: "User",
            roles: ['worker'],
            worker: {
                bio: "This is a bio",
                age: '100',
                gender: "male"
            }
        };

        var badInput = {
            roles: ['worker']
        };

        it('should return a ValidationError if input is wrong', function() {
            return db.updateUser(user._id, badInput).should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.ValidationError));
        });

        it('should create a finished user', function() {
            return db.updateUser(user._id, goodInput).should.be.fulfilled
                .then((u) => user = u)
                .catch((e) => console.log(e.actual));
        });

        it('should throw a NotFoundError if requested id is not in database', function() {
            return db.updateUser('asdfasdf', {}).should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.NotFoundError));
        });

        it('should throw a FieldValiationError if an invalid id is passed', function() {
            return db.updateUser('adasf', {}).should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.FieldValidationError));
        });
    });

    // retrieve user
    describe('getUser', function() {

        it('should retrieve the user', function() {
            return db.getUser(user._id).should.be.fulfilled
                .then((u) => expect(u).to.deep.equal(user));
        });

        it('should throw a NotFoundError if requested id is not in database', function() {
            return db.getUser('asdfasdf').should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.NotFoundError));
        });

        it('should throw a FieldValiationError if an invalid id is passed', function() {
            return db.updateUser('adasfasdfasdfasdfad').should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.FieldValidationError));
        });
    });

    // delete the user
    describe('deleteUser', function() {

        it('should delete the user', function() {
            return db.deleteUser(user._id).should.be.fulfilled
                .then(function() {
                    return db.User.findById(user._id).exec();
                }).should.be.fulfilled
                .then(function(u) {
                    expect(u).to.equal(null);
                });
        });

        it('should throw a NotFoundError if requested id is not in database', function() {
            return db.deleteUser('asdfasdf').should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.NotFoundError));
        });

        it('should throw a FieldValiationError if an invalid id is passed', function() {
            return db.updateUser('adasf').should.be.rejected
                .then((e) => expect(e).to.be.instanceof(db.FieldValidationError));
        });
    });
});
