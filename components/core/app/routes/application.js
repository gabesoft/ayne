export default Ember.Route.extend({
    model: function () {
        if (!this.auth.get('loggedIn')) { return {}; }

        return this.api.getProfile()
           .then(function (response) {
                return {
                    profile : response.data
                  , user    : this.auth.get('user')
                };
            }.bind(this))
           .catch(function (response) {
                if (Ember.get(response, 'error') === 'Unauthorized') {
                    this.auth.logout();
                }
                return {};
            }.bind(this));
    }
  , actions : {
        logout: function () {
            this.api.logout().finally(function () {
                this.auth.logout();
            }.bind(this));
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});
