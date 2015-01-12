export default Ember.Route.extend({
    model: function () {
        return {
            password       : undefined
          , passwordVerify : undefined
        };
    }
});
