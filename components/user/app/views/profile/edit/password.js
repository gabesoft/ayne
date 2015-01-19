import EnterKey from 'mixins/enter-key';
export default Ember.View.extend(EnterKey, {
    willInsertElement: function () {
        this.controller.updateRequireOldPasswordFlag();
    }
});
