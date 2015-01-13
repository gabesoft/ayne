import ReqAuth from 'mixins/req-auth';

export default Ember.Route.extend(ReqAuth, {
    model: function () {
        return {
            password       : undefined
          , passwordVerify : undefined
        };
    }
});
