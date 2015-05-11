var router = require('express').Router(),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

router

    .param('chat', function(req, res, next, id) {
        db.Chat.findById(id).populate('job').exec()
            .then(function(chat) {
                if (!chat) return db.NotFoundError("Chat not found.");
                req.$chat = chat;
            })
            .then(next, next);
    })

    .get('/',
        util.auth,
        function(req, res, next) {
            db.Chat
                .find({
                    users: {$in: [req.user.id]},
                    expires: {$gt: new Date() }
                })
                .sort('updated')
                .populate('job')
                .exec()
                .then(function(chats) {
                    res.send(chats.map(function(chat) {
                        return {
                            _id: chat.id,
                            unread: countUnread(user, chat),
                            users: chat.users,
                        }
                    }));
                })
                .catch(next);
        }
    )

    .get('/:chat',
        util.auth,
        owns,
        function(req, res, next) {

            // see all messages
            req.$chat.messages.forEach(function(message) {
                if (!message.seenBy.includes(req.user.id)) {
                    message.seenBy.push(req.user.id);
                }
            });

            req.$chat.save(function(err, chat) {
                if (err) return next(err);
                res.send(chat);
            });
        }
    )

    .post('/:chat',
        util.auth,
        owns,
        function(req, res, next) {
            res.send(req.$chat);
        }
    )

    .post('/:chat/ack',
        util.auth,
        owns,
        function(req, res, next) {
            req.$chat.messages.unshift({
                user: req.user.id,
                message: req.body.message,
                sent: new Date(),
                seenBy: [req.user.id]
            });

            req.$chat.save(function(err) {
                if (err) return next(err);
                res.sendStatus(200);
            });
        }
    );

function owns(req, res, next) {
    if (req.$chat.users.includes(req.user.id)) return next();
    next(db.NotAllowedError());
}

function countUnread(user, chat) {
    return chat.messages.reduce(function(count, message) {
        return message.seenBy.includes(user.id) ? count : count + 1;
    }, 0);
}
