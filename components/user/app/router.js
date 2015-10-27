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
    this.route('profile', { resetNamespace: true}, function () {
        this.route('view');
        this.route('profile.edit', { resetNamespace: true, path: '/edit' }, function () {
            this.route('details');
            this.route('password');
        });
    });
});

export default Router;
