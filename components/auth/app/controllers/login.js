import App from 'app';

App.LoginController = Ember.Controller.extend({
    error    : {}

  , email    : function () {
        return this.get('model.email');
    }.property('model.email')

  , password : function () {
        return this.get('model.password');
    }.property('model.password')

  , invalid  : function () {
        return this.get('error.email') || this.get('error.form');
    }.property('error.email', 'error.form')

  , invalidForm: function () {
        return !this.get('error.form');
    }.property('error.form')

  , onPasswordChanged: function () {
        this.set('model.password', this.get('password'));
        this.set('error.form', null);
    }.observes('password')

  , onEmailChanged: function () {
        var value = this.get('email');

        this.set('model.email', value);
        this.set('error.email', value ? null : 'This is a required field');
        this.set('error.form', null);
    }.observes('email')

  , actions  : {
        authenticate: function () {
            console.log(this.get('model'));
            this.set('error.form', 'Invalid credentials');
        }
    }
});
