var api               = require('../../../core/lib/api')
  , GmailApi          = require('../../../core/lib/gmail').GmailApi
  , gapi              = new GmailApi()
  , async             = require('async')
  , UserNotFoundError = require('../../../core/lib/errors/user-not-found')
  , auth              = require('../../../core/lib/auth');

function updateUser (request, reply, user) {
    auth.hashPassword(request.payload.password, function (err, hash) {
        if (err) { return reply.fail(err); }

        api.patch('/users/' + user.id, { password: hash }, function (err, response, body) {
            delete body.password;
            reply(body);
        });
    });
}

function update (request, reply) {
    var payload  = request.payload
      , noVerify = request.auth.credentials.temp
      , email    = request.auth.credentials.email
      , userId   = request.auth.credentials.id;

    if (noVerify) {
        return updateUser(request, reply, { id: userId, email: email });
    }

    auth.loginUser({
        user    : { email: email, password: payload.oldPassword }
      , headers : request.headers
    }, function (err, data) {
        if (err) {
            reply.fail(err);
        } else {
            updateUser(request, reply, data.user);
        }
    });
}

function sendEmail (request, reply, user, cb) {
    async.waterfall([
        function (next) {
            auth.linkUser(user, next);
        }
      , function (guid, next) {
            var host = reply.conf('app:host')
              , url  = [ host, 'user', 'reset-password', guid ].join('/');
            request.server.render('user/templates/reset-password-email.jade', {
                host     : host
              , resetUrl : url
            }, function (err, body) {
                next(err, body);
            });
        }
      , function (body, next) {
            gapi.sendEmail({
                to      : user.email
              , subject : 'Reset password'
              , body    : body
            }, next);
        }
    ], cb);
}

function sendResetEmail (request, reply) {
    var data = request.payload;

    api.get('/users', { email: data.email }, function (err, response, body) {
        if (err) {
            reply.fail(err);
        } else if (!body || body.length === 0) {
            reply.fail(new UserNotFoundError(data.email, 'email'));
        } else {
            body = body[0];
            sendEmail(request, reply, body, function (err) {
                return err ? reply.fail(err) : reply({
                    status : 'email-sent'
                  , email  : body.email
                });
            });
        }
    });
}

module.exports = {
    update         : update
  , sendResetEmail : sendResetEmail
};
