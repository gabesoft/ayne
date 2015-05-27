export default Ember.Controller.extend({
    author : function () {
        return this.get('model.author.name')
        || this.get('model.author.login')
        || this.get('model.author');
    }.property('model')
  , hasReadme : function () {
        return Boolean(this.get('model.readme'));
    }.property('model.readme')
  , modalSize : function () {
        return this.get('hasReadme') ? 'full' : 'medium';
    }.property('hasReadme')
  , closeTimeout : function () {
        return this.get('hasReadme') ? 0 : 1000;
    }.property('hasReadme')
  , actions : {
        closeModal : function () {
            return this.send('hideModal');
        }
    }
});
