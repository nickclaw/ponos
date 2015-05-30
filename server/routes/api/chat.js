var router = require('express').Router(),
    vlad = require('vlad'),
    util = require('./util'),
    socket = require('../../setup/socket.io.js');

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
                .populate('users')
                .exec()
                .then(function(chats) {
                    res.send(chats.map(function(chat) {
                        return {
                            _id: chat.id,
                            unread: countUnread(req.user, chat),
                            users: chat.users,
                            job: chat.job,
                            mostRecent: chat.messages[0]
                        }
                    }));
                })
                .then(null, next);
        }
    )

    .get('/:chat',
        util.auth,
        owns,
        function(req, res, next) {
            res.send(req.$chat);
        }
    )

    .post('/:chat',
        util.auth,
        owns,
        function(req, res, next) {
            var data = {
                user: req.user.id,
                message: req.body.message,
                sent: new Date(),
                seenBy: [req.user.id]
            };

            var users = req.$chat.users,
                notUser = users[0] === req.user.id ? users[1] : users[0];

            req.$chat.messages.unshift(data);
            req.$chat.save(function(err) {
                if (err) return next(err);

                socket.of('/user/' + notUser).emit('message', data);
                res.send(req.$chat.messages[0]);
            });
        }
    )

    .post('/:chat/ack',
        util.auth,
        owns,
        function(req, res, next) {

            // see all messages
            req.$chat.messages.forEach(function(message) {
                if (!message.seenBy.includes(req.user.id)) {
                    message.seenBy.push(req.user.id);
                }
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
