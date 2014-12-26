import App from 'app';

App.SignupController = Ember.Controller.extend({
    error: {}
  , createUserPending: false

  , actions : {
        createUser: function () {
            var self = this;
            console.log(this.get('model'));

            self.set('createUserPending', true);
            setTimeout(function () {
                self.set('error.form', 'An error occurred');
                self.set('createUserPending', false);
            }, 4000);
        }
    }
});
