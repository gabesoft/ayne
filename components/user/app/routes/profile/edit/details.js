import ReqAuth from 'mixins/req-auth';

export default Ember.Route.extend(ReqAuth, {
    model : function () {
        return this.api.getProfile()
           .then(function (response) { return response.data; })
           .catch(function (response) {
                if (response.json.statusCode === 401) {
                    this.transitionTo('login');
                }
            }.bind(this));
    }
});
