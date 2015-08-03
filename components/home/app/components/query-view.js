export default Ember.Component.extend({
    classNames: ['query-view'],
    layoutName: 'query-view',
    tagName: 'span',
    queryHtml: function () {
        return this
            .get('model.name')
            .replace(/#([a-z\-]+)/g, '<span class="tag label thin radius">$1</span>')
            .replace(/\(/g, '<span class="paren open-paren">(</span>')
            .replace(/\)/g, '<span class="paren close-paren">)</span>')
            .replace(/\|/g, '<span class="operator or-operator">|</span>')
            .replace(/\&/g, '<span class="operator and-operator">&</span>');
    }.property('model'),
    actions: {
        runQuery: function (query) {
            this.sendAction('runQuery', query);
        }
    },
    didInsertElement: function () {
        this.$('a > .hover-display').append(this.get('queryHtml'));
    }
});
