export default Ember.Route.extend({
    queryParams : {
        search : {
            refreshModel : true
          , replace      : false
        }
    }
  , model : function (params) {
        console.log('PARAMS', params);
        return this.api.getVplugs(params)
           .then(function (response) { return response.data; })
           .catch(function () { return []; });
    }
  , actions : {
        showModal : function (name, model) {
            return this.api.getVplug(model.id)
               .then(function (response) {
                    return this.render(name, {
                        outlet : 'modal'
                      , into   : 'application'
                      , model  : response.data
                    });
                }.bind(this));
        }
      , hideModal : function () {
            function removeHash () {
                history.pushState(""
                  , document.title
                  , window.location.pathname + window.location.search
                );
            }

            removeHash();
            // TODO: add page link to each plugin
            //       the url should reflect the current query

            return this.disconnectOutlet({
                outlet     : 'modal'
              , parentView : 'application'
            });
        }
    }
});
