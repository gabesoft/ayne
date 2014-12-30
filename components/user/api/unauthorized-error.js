UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;
function UnauthorizedError () {
    if (!(this instanceof UnauthorizedError)) {
        return new UnauthorizedError();
    }
    this.statusCode = 401;
    this.name = 'Unauthorized';
    this.message = 'Invalid credentials';
}

module.exports = UnauthorizedError;
