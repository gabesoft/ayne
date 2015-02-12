var Router = Ember.Router.extend({
        rootURL  : '/'
      , location : 'history'
    });

Router.map(function () {
    this.route('/');
    this.route('/enter-url');
    this.route('/urllist');
});

export default Router;
