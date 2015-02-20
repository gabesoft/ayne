export default Ember.View.extend({
    zeroClient: null
  , didInsertElement : function () {
        Ember.run.later(function () {
            var $popup = this.$('.url-popup');
            if ($popup) {
                $popup.removeAttr('hidden');
            }
        }.bind(this), 100);

        var button = document.getElementById('copy-url-button')
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            var ctrl = this.get('controller');
            if (ctrl) {
                ctrl.set('disableCopy', false);
            }
        }.bind(this));

        client.on('aftercopy', function () {
            var ctrl = this.get('controller');
            if (ctrl) {
                ctrl.set('copyTitle', 'Copied');
                ctrl.set('copyClass', 'fa-check-square-o');
                ctrl.set('disableCopy', true);
            }
        }.bind(this));

        this.set('zeroClient', client);
    }
  , willDestroyElement: function  () {
        this.get('controller').send('saveUrl');
        this.get('zeroClient').off();
    }
});
