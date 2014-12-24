import App from 'app';

App.Router.reopen({
    rootURL: '/user/'
});

App.Router.map(function () {
    this.route('login');
    this.route('signup');
    this.route('profile');
    this.route('account');
});

App.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('login');
    }
});

App.LoginRoute = Ember.Route.extend({
    // TODO: if logged in redirect to profile
});

App.LoginRoute = Ember.Route.extend({
    // TODO: if logged in redirect to profile
});

export default App.Router;
