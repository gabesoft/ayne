export default Ember.Route.extend({
    model: function () {
        return this.api.getUrls().then(function (response) {
            return response.data;
        }).catch(function (response) {
            console.log(response);
            return [];
        });
    }
});
