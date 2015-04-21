var Router = Ember.Router.extend({
        rootURL  : '/vim'
      , location : 'history'
    });

Router.map(function () {
    this.route('/vim');
});

export default Router;
