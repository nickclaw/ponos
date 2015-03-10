module.exports = {
    createable: {
        title: true,
        location: {
            lat: true,
            long: true
        },

        start: true,
        end: true,
        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true
    },

    editable: {
        title: true,
        location: {
            lat: true,
            long: true
        },

        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true
    },

    viewable: {
        _id: true,
        poster: true,
        title: true,
        location: {
            lat: true,
            long: true
        },

        start: true,
        end: true,
        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true,
        created: true,
        updated: true
    }
}
