export default Ember.View.extend({
    zeroClient: null
  , didInsertElement : function () {
        this.$('.url-popup').fadeIn('fast');

        var button = document.getElementById('copy-url-button')
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            if (this.controller) {
                this.controller.set('disableCopy', false);
            }
        }.bind(this));

        client.on('aftercopy', function () {
            if (this.controller) {
                this.controller.set('copyTitle', 'Copied');
                this.controller.set('copyClass', 'fa-check-square-o');
                this.controller.set('disableCopy', true);
            }
        }.bind(this));

        this.set('zeroClient', client);
    }
  , willDestroyElement: function  () {
        this.get('controller').send('saveUrl');
        this.get('zeroClient').off('ready aftercopy');
    }
});
