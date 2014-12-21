import App from 'app';

App.Router.map(function () {
    this.route('login');
    this.route('signup');
});

App.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('login');
    }
});

export default App.Router;
