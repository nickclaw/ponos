var shortId = require('shortid');

module.exports = function(schema) {
    schema.add({
        _id: {
            type: String,
            unique: true,
            'default': shortId.generate
        }
    });
}
