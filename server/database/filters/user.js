module.exports = {
    editable: {
        firstName: true,
        lastName: true,
        phone: true,

        worker: {
            bio: true,
            experience: true,
            age: true,
            gender: true
        },

        employer: {
            bio: true,
            url: true
        }
    },

    viewable: {
        _id: true,
        firstName: true,
        lastName: true,
        phone: true,
        roles: true,

        worker: {
            bio: true,
            experience: true,
            age: true,
            gender: true
        },

        employer: {
            bio: true,
            url: true
        },

        new: true,
        finished: true,
        created: true,
        updated: true
    }
}
