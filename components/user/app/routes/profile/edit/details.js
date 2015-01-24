import ReqAuth from 'mixins/req-auth';

export default Ember.Route.extend(ReqAuth, {
    model : function () {
        return this.api.getProfile()
           .then(function (response) { return response.data; })
           .catch(function (response) {
                var code = Ember.get(response, 'json.statusCode');
                if (code === 401) {
                    this.transitionTo('login');
                }
            }.bind(this));
    }
});
