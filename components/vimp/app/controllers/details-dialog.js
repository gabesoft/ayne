export default Ember.Controller.extend({
    author : function () {
        return this.get('model.author.name')
        || this.get('model.author.login')
        || this.get('model.author');
    }.property('model')
  , modalSize : function () {
        return this.get('model.hasReadme') ? 'full' : 'tiny';
    }.property('model.hasReadme')
  , closeTimeout : function () {
        return this.get('model.hasReadme') ? 0 : 1000;
    }.property('model.hasReadme')
  , actions : {
        closeModal : function () {
            return this.send('hideModal');
        }
    }
});
