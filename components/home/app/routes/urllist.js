export default Ember.Route.extend({
    model: function () {
        return this.api.getUrls({ sort: 'updatedAt:desc' }).then(function (response) {
            return response.data;
        }).catch(function (response) {
            console.log(response);
            return [];
        });
    }
});
