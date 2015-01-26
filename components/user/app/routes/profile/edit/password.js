import ReqAuth from 'user/app/mixins/req-auth';

export default Ember.Route.extend(ReqAuth, {
    model: function () {
        return {
            password       : undefined
          , passwordVerify : undefined
        };
    }
});
