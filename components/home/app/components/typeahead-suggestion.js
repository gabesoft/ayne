export default Ember.Component.extend({
    layoutName: 'typeahead-suggestion',
    actions: {
        deleteTag: function (tag) {
            this.sendAction('deleteTag', tag);
        }
    }
});
