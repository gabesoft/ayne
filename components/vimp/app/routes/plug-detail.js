export default Ember.Route.extend({
    model: function (params) {
        return this.api.getVplug(params.id)
            .then(function (response) {return response.data;})
            .catch(function () {return {};});
    }
});