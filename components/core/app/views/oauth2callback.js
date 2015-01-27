export default Ember.View.extend({
    initCopyButton: function () {
        var button = document.getElementById('copy-button')
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            this.controller.set('disableCopy', false);
        }.bind(this));

        client.on('aftercopy', function () {
            this.controller.set('copyLabel', 'Copied');
            this.controller.set('copyClass', 'fa-check-square-o');
            this.controller.set('disableCopy', true);
        }.bind(this));
    }.on('didInsertElement')
});
