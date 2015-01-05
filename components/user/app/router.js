var Router = Ember.Router.extend({
    rootURL  : '/user/'
  , location : 'history'
});

Router.map(function () {
    this.route('login');
    this.route('signup');
    this.resource('profile', function () {
        this.route('edit');
        this.route('view');
    });
});

export default Router;
