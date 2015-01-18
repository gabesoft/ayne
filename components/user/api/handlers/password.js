var api               = require('../../../core/lib/api')
  , GmailApi          = require('../../../core/lib/gmail').GmailApi
  , gapi              = new GmailApi()
  , UserNotFoundError = require('../../api-errors/user-not-found')
  , userHelper        = require('../helpers/user');

function updateUser (request, reply, user) {
    userHelper.hashPassword(request.payload.password, function (err, hash) {
        if (err) { return reply.fail(err); }

        api.patch('/users/' + user.id, { password: hash }, function (err, response, body) {
            delete body.password;
            reply(body);
        });
    });
}

function update (request, reply) {
    var data  = request.payload
      , email = request.auth.credentials.email;

    userHelper.loginUser({ email: email, password: data.oldPassword }, function (err, user) {
        if (err) {
            reply.fail(err);
        } else {
            updateUser(request, reply, user);
        }
    });
}

function sendEmail (request, reply, user, cb) {
    // TODO: set up the reset url
    request.server.render('user/templates/reset-password-email.jade', {
        host     : reply.conf('app:host')
      , resetUrl : [ reply.conf('app:host'), 'user', 'reset-password' ].join('/')
    }, function (err, body) {
        gapi.sendEmail({
            to      : user.email
          , subject : 'Reset password'
          , body    : body
        }, cb);
    });
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
                    status : 'email_sent'
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
