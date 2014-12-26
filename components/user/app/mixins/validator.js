import App from 'app';

export default Ember.Mixin.create({
    error      : {}
  , invalid    : false

  , validEmail : function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

  , invalidate : function (name) {
        this.addObserver('error.' + name, this, function (sender, key) {
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

  , requiredField : function (name) {
        this.invalidate(name);
        this.addObserver('model.' + name, this, function (sender, key) {
            var value = this.get(key);
            if (!value) {
                this.set('error.' + name, 'This is a required field');
            } else {
                this.set('error.' + name, null);
            }
        });
    }

  , emailField: function (name) {
        this.invalidate(name);
        this.addObserver('model.' + name, this, function (sender, key) {
            var value = this.get(key)
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
});
