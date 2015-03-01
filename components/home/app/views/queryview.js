export default Ember.View.extend({
    classNames   : [ 'query-view' ]
  , templateName : 'queryview'
  , tagName      : 'span'
  , queryHtml    : function () {
        return this
           .get('model.name')
           .replace(/#([a-z\-]+)/g, '<span class="tag label thin radius">$1</span>')
           .replace(/\(/g, '<span class="paren open-paren">(</span>')
           .replace(/\)/g, '<span class="paren close-paren">)</span>')
           .replace(/\|/g, '<span class="operator or-operator">|</span>')
           .replace(/\&/g, '<span class="operator and-operator">&</span>');
    }.property('model')
  , didInsertElement : function () {
        this.$('a > .hover-display').append(this.get('queryHtml'));
    }
});
