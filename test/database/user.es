
describe('user function', function() {

    var user;

    // create unfinished user
    describe('createUser', function() {
        this.timeout(5000);

        var input = {
            firstName: "Test",
            lastName: "User",

            auth: {
                local: {
                    email: "user@example.com",
                    password: "password"
                }
            }
        };

        it('should create a new unfinished user', function() {
            return db.createUser(input).should.be.fulfilled
                .then((u) => user = u);
        })
    });

    // complete user profile
    describe('updateUser', function() {
        var input = {

        };

        it('should create a finished user', function() {
            return db.updateUser(user._id, input).should.be.fulfilled
                .then((u) => user = u);
        });
    });

    // retrieve user
    describe('getUser', function() {

        it('should retrieve the user', function() {
            return db.getUser(user._id).should.be.fulfilled
                .then((u) => expect(u).to.deep.equal(user));
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
    });
});
