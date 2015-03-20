export default Ember.Route.extend({
    beforeModel: function () {
        if (!this.controllerFor('application').get('loggedIn')) {
            window.location.replace('/user');
        }
    }
  , model: function () {
        var urls = this.api.getUrls()
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
