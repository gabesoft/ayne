var api = require('../api'),
    UnauthorizedError = require('../errors/unauthorized'),
    token = require('./token'),
    EmailExistsError = require('../errors/email-exists'),
    TokenExpiredError = require('../errors/token-expired'),
    moment = require('moment'),
    conf = require('../../../../config/store'),
    ttlGuid = moment.duration(conf.get('user-guid:ttl:value'), conf.get('user-guid:ttl:unit')),
    bcrypt = require('bcrypt');

function hashPassword(password, cb) {
  bcrypt.genSalt(11, function (err, salt) {
    if (err) {
      return cb(err);
    }

    bcrypt.hash(password || '', salt, function (err, hash) {
      cb(err, hash);
    });
  });
}

function makeClientUser(user) {
  return {
    id: user.id,
    email: user.email
  };
}

function createUser(data, cb) {
  hashPassword(data.password, function (err, hash) {
    if (err) {
      return cb(err);
    }

    data.password = hash;
    data.type = 'ayne';

    api.post('/users', data, function (err, response, body) {
      if (err && err.statusCode === 409) {
        return cb(new EmailExistsError(data.email));
      } else if (err) {
        return cb(err);
      }

      cb(null, makeClientUser(body));
    });
  });
}

function loginUserWithGuid(guid, cb) {
  api.get('/users', {
    guid: guid,
    type: 'ayne'
  }, function (err, response, user) {
    if (err || !user) {
      return cb(new TokenExpiredError());
    }

    token.temp(user, function (err, tk) {
      return err ? cb(err) : cb(null, {
        user: makeClientUser(user),
        token: tk,
        noVerify: true
      });
    });
  });
}

function loginUser(data, cb) {
  verifyUser(data.user, function (err, user) {
    if (err) {
      return cb(err);
    }

    token.make(user, function (err, tk) {
      if (err) {
        return cb(err);
      }

      cb(null, {
        user: user,
        token: tk
      });
    });
  });
}

function logoutUser(data, cb) {
  token.remove(data.user, cb);
}

function verifyUser(data, cb) {
  api.get('/users', {
    email: data.email,
    type: 'ayne'
  }, function (err, response, body) {
    if (err && err.statusCode === 404) {
      return cb(new UnauthorizedError());
    }
    if (err) {
      return cb(err);
    }
    if (body.length !== 1) {
      return cb(new UnauthorizedError());
    }

    body = body[0];
    bcrypt.compare(data.password || '', body.password, function (err, match) {
      if (err) {
        return cb(err);
      }
      if (!match) {
        return cb(new UnauthorizedError());
      }

      cb(null, makeClientUser(body));
    });
  });
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function linkUser(user, cb) {
  var guid = generateUUID();
  api.put('/users/link', {
    guid: guid,
    ttlInSeconds: ttlGuid.asSeconds(),
    userId: user.id
  }, function (err) {
    cb(err, guid);
  });
}


module.exports = {
  hashPassword: hashPassword,
  verifyUser: verifyUser,
  loginUser: loginUser,
  loginUserWithGuid: loginUserWithGuid,
  logoutUser: logoutUser,
  createUser: createUser,
  linkUser: linkUser
};