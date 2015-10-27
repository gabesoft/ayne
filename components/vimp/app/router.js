var Router = Ember.Router.extend({
        rootURL  : '/vim'
      , location : 'history'
    });

Router.map(function () {
    this.route('/vim');
    this.route('plug-detail', { resetNamespace: true, path: '/:id' });
});

export default Router;
