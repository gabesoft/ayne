export default Ember.View.extend({
    zeroClient: null
  , didInsertElement : function () {
        Ember.run.later(function () {
            var $popup = this.$('.url-popup');
            if ($popup) {
                $popup.removeAttr('hidden');
            }
        }.bind(this), 200);

        var button = document.getElementById('copy-url-button')
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            var ctrl = this.get('controller');
            if (ctrl && !ctrl.get('isDestroyed')) {
                ctrl.set('disableCopy', false);
            }
        }.bind(this));

        client.on('aftercopy', function () {
            var ctrl = this.get('controller');
            if (ctrl && !ctrl.get('isDestroyed')) {
                ctrl.set('copyTitle', 'Copied');
                ctrl.set('copyClass', 'fa-check-square-o');
                ctrl.set('disableCopy', true);
            }
        }.bind(this));

        client.on('error', function (e) {
            console.log('copy failed', e);
            client.destroy();
        });

        this.set('zeroClient', client);

        this.$().on('click', 'a.original-link', function () {
            this.get('controller').send('urlClick');
        }.bind(this));
    }
  , willDestroyElement: function  () {
        var client = this.get('zeroClient');

        if (client) {
            client.destroy();
        }

        this.get('controller').send('saveUrl');
    }
});
