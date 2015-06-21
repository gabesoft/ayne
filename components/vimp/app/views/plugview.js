export default Ember.View.extend({
    zeroClient : null
  , didInsertElement : function () {
        var id     = this.get('controller.model.id') + '-copy-clone-url-button'
          , button = document.getElementById(id)
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            var ctrl = this.get('controller');
            if (ctrl && !ctrl.get('isDestroyed')) {
                ctrl.set('enabledCloneUrlCopy', true);
            }
        }.bind(this));

        client.on('aftercopy', function () {
            var ctrl = this.get('controller');
            if (ctrl && !ctrl.get('isDestroyed')) {
                ctrl.set('copyCloneUrlTitle', 'Copied');
                ctrl.set('copyCloneUrlClass', 'fa-check-square-o');
            }

            Ember.run.later(function () {
                if (ctrl && !ctrl.get('isDestroyed')) {
                    ctrl.set('copyCloneUrlClass', 'fa-copy');
                }
            }, 1000);
        }.bind(this));

        this.set('zeroClient', client);
    }

  , willDestroyElement: function  () {
        var client = this.get('zeroClient');

        if (client) {
            client.destroy();
        }
    }
});
