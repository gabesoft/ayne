export default Ember.View.extend({
    keyDown: function (e) {
        if (e.keyCode === 13) {
            this.get('controller').send('reset', e.keyCode);
        }
    }
});
