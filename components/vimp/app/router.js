var Router = Ember.Router.extend({
        rootURL  : '/vim'
      , location : 'history'
    });

Router.map(function () {
    // TODO: add the search query in the url
    //       add anchors to plugins
    //       push the plugin anchors on details modal open and pop on close
    this.route('/vim');
});

export default Router;
