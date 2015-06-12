export default Ember.Controller.extend({
    author : function () {
        return this.get('model.author.name')
        || this.get('model.author.login')
        || this.get('model.author');
    }.property('model')
  , aboveThreshold : function () {
        return this.get('model.isPlugin') > 0.3;
    }.property('isPlugin')
});
