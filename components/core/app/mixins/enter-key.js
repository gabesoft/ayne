import Keys from 'core/app/mixins/keys';

export default Ember.Mixin.create(Keys, {
    keyDown: function (e) {
        var ctrl = null;
        if (e.keyCode === this.get('keys.ENTER')) {
            ctrl = this.get('controller');
            ctrl.send(ctrl.onEnterAction, e);
        }
    }
});
