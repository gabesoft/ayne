export default Ember.Component.extend({
    queryParams: ['code'],
    text: null,
    disableCopy: true,
    copyLabel: 'Copy to clipboard',
    copyClass: 'fa-files-o',
    layoutName: 'copy-button',
    initCopyButton: function () {
        var button = document.getElementById('copy-button'),
            client = new ZeroClipboard(button);

        client.on('ready', function () {
            this.set('disableCopy', false);
        }.bind(this));

        client.on('aftercopy', function () {
            this.set('copyLabel', 'Copied');
            this.set('copyClass', 'fa-check-square-o');
            this.set('disableCopy', true);
        }.bind(this));
    }.on('didInsertElement')
});