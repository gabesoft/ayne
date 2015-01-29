var Router = Ember.Router.extend({
        rootURL  : '/'
      , location : 'history'
    });

Router.map(function () {
    this.route('/');
});

export default Router;
