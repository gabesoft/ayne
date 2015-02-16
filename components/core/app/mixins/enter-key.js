export default Ember.Mixin.create({
    keyDown: function (e) {
        var ctrl = null;
        if (e.keyCode === 13) {
            ctrl = this.get('controller');
            ctrl.send(ctrl.onEnterAction);
        }
    }
});
