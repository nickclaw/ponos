
module.exports = function(schema) {

    schema.add({
        updated: { type: Date },
        created: { type: Date }
    })

    schema.pre('save', function(next) {
        if (!this.created) this.created = new Date();
        this.updated = new Date();
        next();
    });
};
