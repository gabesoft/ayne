import ReqAuth from 'user/app/mixins/req-auth';

export default Ember.Route.extend(ReqAuth, {
    model : function () {
        return this.api.getProfile()
           .then(function (response) { return response.data; })
           .catch(function (response) {
                var code = Ember.get(response, 'json.statusCode');
                if (code === 401) {
                    this.transitionTo('login');
                } else {
                    console.log('failed to get profile', response);
                    return {};
                }
            }.bind(this));
    }
});
