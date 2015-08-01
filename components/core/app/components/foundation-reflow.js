export default Ember.Component.extend({
    didInsertElement: function () {
        Ember.$(document).foundation('reflow');
    }
});
