export default Ember.Controller.extend({
    hasReadmeOrDoc: function () {
        return this.get('model.hasReadme') || this.get('model.hasDoc');
    }.property('model'),
    hasReadmeAndDoc: function () {
        return this.get('model.hasReadme') && this.get('model.hasDoc');
    }.property('model'),
    noReadmeOrDoc: function () {
        return !this.get('hasReadmeOrDoc');
    }.property('hasReadmeOrDoc'),
    hasOnlyDoc: function () {
        return this.get('model.hasDoc') && !this.get('model.hasReadme');
    }.property('model'),
    hasOnlyReadme: function () {
        return this.get('model.hasReadme') && !this.get('model.hasDoc');
    }.property('model')
});