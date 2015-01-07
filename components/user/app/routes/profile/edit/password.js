export default Ember.Route.extend({
    model: function () {
        return {
            password       : ''
          , passwordVerify : ''
        }
    }
});
