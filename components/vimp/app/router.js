var Router = Ember.Router.extend({
        rootURL  : '/vim'
      , location : 'history'
    });

Router.map(function () {
    this.route('/vim');
    this.resource('plug-detail', { path: '/:id' });
});

export default Router;
