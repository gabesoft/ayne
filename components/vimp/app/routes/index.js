export default Ember.Route.extend({
    model : function () {
        return this.api.getVplugs()
           .then(function (response) { return response.data; })
           .catch(function () { return []; });
    }
});
