import EnterKey from 'core/app/mixins/enter-key';
export default Ember.View.extend(EnterKey, {
    willInsertElement: function () {
        this.get('controller').updateRequireOldPasswordFlag();
    }
});
