export default Ember.Route.extend({
    init : function () {
        this._super();
        this.addObserver('loggedIn', this, function () {
            this.refresh();
        });
    }
  , model: function () {
        if (!this.get('loggedIn')) { return {}; }

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
    }
  , loggedIn: function () {
        return this.auth.get('loggedIn');
    }.property('auth.loggedIn')
});
