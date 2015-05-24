export default Ember.Controller.extend({
    actions : {
        closeModal : function () {
            return this.send('hideModal');
        }
    }
});
