export default Ember.Component.extend({
    tagName           : 'input'
  , attributeBindings : ['type', 'data-role']
  , type              : 'text'
  , 'data-role'       : 'tagsinput'
  , multiple          : true
  , placeholder       : null

  , didInsertElement: function ()  {
        this._super();

        var $input = this.$();

        $input.val((this.get('value') || []).join(','));

        this.$().tagsinput({
            confirmKeys     : [13, 44, 32]
          , trimValue       : true
          , freeInput       : true
          , allowDuplicates : false
        });

        $input.on('itemAdded', function () {
            this.set('value', this.$().tagsinput('items'));
        }.bind(this));

        $input.on('itemRemoved', function () {
            this.set('value', $input.tagsinput('items'));
        }.bind(this));

        $input.parent().find('.bootstrap-tagsinput > input').focus(function (e) {
            this.$(e.currentTarget).parent().addClass('active');
        }.bind(this)).blur(function (e) {
            this.$(e.currentTarget).parent().removeClass('active');
        }.bind(this));
    }
});
