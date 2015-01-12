export default Ember.Mixin.create({
    init: function () {
        this._super();
        this.set('error', {});
        this.set('validators', {});
        this.set('invalid', false);
    }

  , resetErrors : function () {
        this.set('error', {});
    }

  , validEmail : function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

  , validAlphaNumeric : function (text) {
        var regex = /^[a-zA-Z0-9\-]*$/;
        return regex.test(text);
    }

  , validate: function () {
        Ember.$.each(this.get('validators'), function (key, runValidator) {
            runValidator(true);
        });
        return !this.get('invalid');
    }

  , addErrorObserver : function (name) {
        this.addObserver('error.' + name, this, function () {
            this.set('invalid', this.hasErrors(this.get('error')));
        });
    }

  , hasErrors : function (obj) {
        if (!obj) { return false; }

        var has = false;

        Ember.$.each(obj, function (key, value) {
            if (has) {
                return;
            } else if (typeof value === 'string') {
                has = true;
            } else if (value) {
                has = this.hasErrors(obj[key]);
            }
        }.bind(this));

        return has;
    }

  , setSafe: function (path, value) {
        var name   = path.slice(path.lastIndexOf('.') + 1)
          , parent = (path === name) ? name : path.slice(0, path.length - (name.length + 1));

        if (parent != name && !this.get(parent)) {
            this.setSafe(parent, {});
        }

        this.set(path, value);
    }

  , addValidator: function (name, fn) {
        this.set('validators.' + name, fn.bind(this));
    }

  , getValidator: function (name) {
        return this.get('validators.' + name);
    }

  , setError : function (type, name, value) {
        if (!value) {
            // TODO: remove error
        } else if (typeof value === 'string') {
            // TODO: set error to value
        } else if (value.then) {
            // TODO: handle promise
            value
               .then(function (val) {
                    // TODO: set error to val
                })
               .catch(function () {
                    // TODO: set error to null
                });
        }
    }

  , validateField : function (type, name, validator, wait) {
        var key = type + ':' + name.replace(/\./, ':');
        this.addErrorObserver(name);
        this.addValidator(key, function () {

        });
        this.addObserver(name, this, function () {
            var validate = this.getValidator(key);

            Ember.run.debounce(this, function () {
                this.setError(type, name, validate());
            }, wait || 0);
        });
    }

  , requiredField : function (name) {
        this.validateField('requiredField', name, function (force) {
            var value = this.get(name);
            if (!force && typeof value === 'undefined') {
                return;
            } else if (!value) {
                this.setSafe('error.' + name, 'This is a required field');
            } else {
                this.setSafe('error.' + name, null);
            }
        });
    }

  , alphaNumericField: function (name) {
        this.validateField('alphaNumericField', name, function () {
            var value = this.get(name)
              , valid = this.validAlphaNumeric(value);

            if (!value) {
                return;
            } else if (!valid) {
                this.setSafe('error.' + name, 'Please enter only letters or numbers in this field');
            } else {
                this.setSafe('error.' + name, null);
            }
        });
    }

  , emailField: function (name) {
        this.validateField('emailField', name, function () {
            var value = this.get(name)
              , valid = this.validEmail(value);

            if (!value) {
                return;
            } else if (!valid) {
                this.setSafe('error.' + name, 'Please enter a valid email address');
            } else {
                this.setSafe('error.' + name, null);
            }
        });
    }

  , passwordFields: function (name1, name2) {
        var key  = 'passwordFields:' + name1 + ':' + name2;

        this.addValidator(key, function (force) {
            var value1 = this.getWithDefault(name1, '')
              , value2 = this.getWithDefault(name2, '');

            if (value1 === value2) {
                this.setSafe('error.passwords', null);
            } else {
                this.setSafe('error.passwords', 'Passwords don\'t match');
            }
        });

        this.addErrorObserver('passwords');
        this.addObserver(name1, this, function () {
            this.getValidator(key)();
        });
        this.addObserver(name2, this, function () {
            this.getValidator(key)();
        });
    }
});
