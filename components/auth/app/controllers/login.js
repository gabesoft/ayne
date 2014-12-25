import App from 'app';

App.LoginController = Ember.Controller.extend({
    error : {}
  , authenticating: false

  , invalid : function () {
        return this.get('error.email') || this.get('error.form');
    }.property('error.email', 'error.form')

  , disableLogin : function () {
        return this.get('invalid') || this.get('authenticating');
    }.property('invalid', 'authenticating')

  , onPasswordChanged: function () {
        this.set('error.form', null);
    }.observes('model.password')

  , onEmailChanged: function () {
        var value = this.get('model.email');

        this.set('error.email', value ? null : 'This is a required field');
        this.set('error.form', null);
    }.observes('model.email')

  , actions : {
        authenticate: function () {
            var self = this;
            console.log(this.get('model'));

            self.set('authenticating', true);
            setTimeout(function () {
                self.set('error.form', 'Invalid credentials');
                self.set('authenticating', false);
            }, 5000);
        }
    }
});
