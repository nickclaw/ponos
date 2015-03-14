var router = require('express').Router();

module.exports = router;

//
// This router is attached to the /api/job/:id/application
// route, meaning it is guaranteed access to req.$job
//

router

    .param('app', function(req, res, next, id) {
        
    })

    .post('/',
        function(req, res, next) {

        },
        send
    )

    .get('/',
        function(req, res, next) {

        },
        send
    )

    .get('/:app', send)

    .delete('/:app',
        function(req, res, next) {

        },
        send
    );

//
// Util
//

function send() {

}

function owns() {

}
