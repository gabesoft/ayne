import App from 'app';

App.LoginController = Ember.Controller.extend({
    error : {}
  , authenticatePending: false

  , invalid : function () {
        return this.get('error.email') || this.get('error.form');
    }.property('error.email', 'error.form')

  , disableLogin : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , onPasswordChanged: function () {
        this.set('error.form', null);
    }.observes('model.password')

  , onEmailChanged: function () {
        var email      = this.get('model.email')
          , validEmail = function (input) {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test(email);
            };

        if (!email) {
            this.set('error.email', 'This is a required field');
        } else if (!validEmail(email)) {
            this.set('error.email', 'Please enter a valid email address');
        } else {
            this.set('error.email', null);
        }

        this.set('error.form', null);
    }.observes('model.email')

  , actions : {
        authenticate: function () {
            var self = this;
            console.log(this.get('model'));

            self.set('authenticatePending', true);
            setTimeout(function () {
                self.set('error.form', 'Invalid credentials');
                self.set('authenticatePending', false);
            }, 5000);
        }
    }
});
