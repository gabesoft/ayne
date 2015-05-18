export default Ember.Controller.extend({
    author : function () {
        return this.get('model.author.name') || this.get('model.author.login');
    }.property('model')
});
