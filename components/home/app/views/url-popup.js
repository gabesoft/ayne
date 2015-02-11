export default Ember.View.extend({
    templateName     : 'url-popup'
  , didInsertElement : function () {
        this.$('.url-popup').fadeIn('fast');
    }
  , willDestroyElement: function  () {
        this.get('controller').send('saveUrl');
    }
});
