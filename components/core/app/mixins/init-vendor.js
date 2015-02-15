export default Ember.Mixin.create({
    initFoundation: function () {
        Ember.$(document).foundation({});
    }.on('didInsertElement')
});
