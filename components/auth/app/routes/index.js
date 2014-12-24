import App from 'app';

App.IndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('login');
    }
});

export default App.IndexRoute;
