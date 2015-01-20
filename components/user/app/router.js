var Router = Ember.Router.extend({
        rootURL  : '/user/'
      , location : 'history'
    });

Router.map(function () {
    this.route('login');
    this.route('signup');
    this.route('forgot-password');
    this.route('reset-password', { path: 'reset-password/*guid' });
    this.route('reset-password-success');
    this.route('reset-password-failure');
    this.resource('profile', function () {
        this.resource('profile.edit', { path: '/edit' }, function () {
            this.route('details');
            this.route('password');
        });
        this.route('view');
    });
});

export default Router;
