export default Ember.View.extend({
    initCopyButton: function () {
        var button = document.getElementById('copy-button')
          , client = new ZeroClipboard(button);

        client.on('ready', function () {
            this.get('controller').set('disableCopy', false);
        }.bind(this));

        client.on('aftercopy', function () {
            this.get('controller').set('copyLabel', 'Copied');
            this.get('controller').set('copyClass', 'fa-check-square-o');
            this.get('controller').set('disableCopy', true);
        }.bind(this));
    }.on('didInsertElement')
});
