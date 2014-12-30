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

  , validate: function () {
        Ember.$.each(this.get('validators'), function (key, runValidator) {
            runValidator(true);
        });
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
        var self = this;
        this.set('validators.' + name, function () {
            fn.apply(self, arguments);
        });
    }

  , getValidator: function (name) {
        return this.get('validators.' + name);
    }

  , requiredField : function (name) {
        var key = 'requiredField:' + name;

        this.invalidate(name);
        this.addValidator(key, function (force) {
            var value = this.get('model.' + name);
            if (!force && typeof value === 'undefined') {
                return;
            } else if (!value) {
                this.set('error.' + name, 'This is a required field');
            } else {
                this.set('error.' + name, null);
            }
        });
        this.addObserver('model.' + name, this, function () {
            this.getValidator(key)();
        });
    }

  , emailField: function (name) {
        var key = 'emailField:' + name;

        this.addValidator(key, function () {
            var value = this.get('model.' + name)
              , valid = this.validEmail(value);

            if (!value) {
                return;
            } else if (!valid) {
                this.set('error.' + name, 'Please enter a valid email address');
            } else {
                this.set('error.' + name, null);
            }
        });
        this.invalidate(name);
        this.addObserver('model.' + name, this, function () {
            this.getValidator(key)();
        });
    }

  , passwordFields: function (name1, name2) {
        var key  = 'passwordFields:' + name1 + ':' + name2
          , key1 = 'model.' + name1
          , key2 = 'model.' + name2;

        this.addValidator(key, function (force) {
            var value1 = this.getWithDefault(key1, '')
              , value2 = this.getWithDefault(key2, '');

            if (value1 === value2) {
                this.set('error.passwords', null);
            } else {
                this.set('error.passwords', 'Passwords don\'t match');
            }
        });

        this.invalidate('passwords');
        this.addObserver(key1, this, function () {
            this.getValidator(key)();
        });
        this.addObserver(key2, this, function () {
            this.getValidator(key)();
        });
    }
});
