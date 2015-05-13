var router = require('express').Router(),
    util = require('./util'),
    vlad = require('vlad'),
    path = require('path'),
    fs = require('fs'),
    gm = require('gm'),
    multi = require('multiparty'),
    geocoder = require('node-geocoder')('nominatimmapquest', 'http');

module.exports = router;

router
    .post('/image',
        util.auth,

        // get file
        // taken from https://github.com/nickclaw/mypassword.is/blob/master/server/util.js#L40
        function(req, res, next) {
            var form = new multi.Form({
                autoFiles: true
            });

            form.parse(req, function(err, fields, files) {
                if (err) return next(err);
                if (!files.file || !files.file.length) return next(vlad.FieldValidationError("No file uploaded."));

                req.file = {
                    file: files.file[0],
                    remove: function() {
                        fs.unlink(files.file[0].path, function(){ /* noooop */ });
                    }
                };

                next();
            });
        },

        // parse file
        function(req, res, next) {
            req.file.image = gm(req.file.file.path);
            req.file.image.identify(function(err, data) {
                if (err) return next(vlad.FieldValidationError("Invalid image file. " + err.message));
                req.file.data = data;
                next();
            });

        },

        // validate file
        function(req, res, next) {
            var data = req.file.data;

            if (data.format !== 'PNG' && data.format !== 'JPEG') {
                return next(vlad.FieldValidationError("Invalid file type."));
            }

            // size checks?

            next();

        },

        // convert
        function(req, res, next) {
            var image = req.file.image;
            image
                .strip()
                .interlace('Plane')
                .quality(85)
                .toBuffer(function(err, buffer) {
                    if (err) return next(err);
                    req.file.buffer = buffer;

                    next();
                });
        },

        // save file
        function(req, res, next) {
            // clear temp file
            req.file.remove();
            delete req.file.file;
            delete req.file.remove;

            var name = Date.now() + '.jpg';

            fs.writeFile(
                path.join(__dirname, '../../..', C.APP.RES_DIR, 'upload', name),
                req.file.buffer,
                function(err) {
                    if (err) return next(err);
                    res.send({
                        file: path.join('/static/upload/', name)
                    });
                }
            );
        }
    )

    .get('/address',
        util.auth,
        vlad.middleware('query', {
            address: vlad.string.required.min(1)
        }),
        function(req, res, next) {
            geocoder.geocode(req.query.address)
                .then(
                    function(coords) {
                        if (!coords.length) return next(db.NotFoundError());
                        res.send(coords[0]);
                    },
                    next
                );
        }
    )
;
