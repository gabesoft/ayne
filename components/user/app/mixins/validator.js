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

  , invalidate : function (name) {
        this.addObserver('error.' + name, this, function () {
            this.set('invalid', this.hasErrors());
        });
    }

  , hasErrors : function () {
        var has = false;
        Ember.$.each(this.get('error'), function (key, value) {
            if (value) {
                has = true;
            }
        });
        return has;
    }

  , addValidator: function (name, fn) {
        this.set('validators.' + name, fn.bind(this));
    }

  , getValidator: function (name) {
        return this.get('validators.' + name);
    }

  , validateField : function (type, name, validator) {
        var key = type + ':' + name;
        this.invalidate(name);
        this.addValidator(key, validator);
        this.addObserver(name, this, function () {
            this.getValidator(key)();
        });
    }

  , requiredField : function (name) {
        this.validateField('requiredField', name, function (force) {
            var value = this.get(name);
            if (!force && typeof value === 'undefined') {
                return;
            } else if (!value) {
                this.set('error.' + name, 'This is a required field');
            } else {
                this.set('error.' + name, null);
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
                this.set('error.' + name, 'Please enter only letters or numbers in this field');
            } else {
                this.set('error.' + name, null);
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
                this.set('error.' + name, 'Please enter a valid email address');
            } else {
                this.set('error.' + name, null);
            }
        });
    }

  , passwordFields: function (name1, name2) {
        var key  = 'passwordFields:' + name1 + ':' + name2;

        this.addValidator(key, function (force) {
            var value1 = this.getWithDefault(name1, '')
              , value2 = this.getWithDefault(name2, '');

            if (value1 === value2) {
                this.set('error.passwords', null);
            } else {
                this.set('error.passwords', 'Passwords don\'t match');
            }
        });

        this.invalidate('passwords');
        this.addObserver(name1, this, function () {
            this.getValidator(key)();
        });
        this.addObserver(name2, this, function () {
            this.getValidator(key)();
        });
    }
});
