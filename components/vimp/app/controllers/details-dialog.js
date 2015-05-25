export default Ember.Controller.extend({
    hasReadme : function () {
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
