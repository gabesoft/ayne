import EnterKey from 'user/app/mixins/enter-key';
export default Ember.View.extend(EnterKey, {
    willInsertElement: function () {
        this.get('controller').updateRequireOldPasswordFlag();
    }
});
