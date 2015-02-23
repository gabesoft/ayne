export default Ember.Route.extend({
    model: function () {
        var urls = this.api.getUrls({ sort: 'updatedAt:desc' })
               .then(function (response) { return response.data; })
               .catch(function () { return []; })
          , queries = this.api.getQueries({ limit: 50 })
               .then(function (response) { return response.data; })
               .catch(function () { return []; });

        return Ember.RSVP.hash({
            urls    : urls
          , queries : queries
        });
    }
});
