export default Ember.Component.extend({
    tagName           : 'input'
  , attributeBindings : ['type', 'data-role', 'name' ]
  , type              : 'text'
  , name              : 'name'
  , 'data-role'       : 'tagsinput'
  , multiple          : true
  , placeholder       : null

  , init: function () {
        this._super();
        this.addObserver('value', this, function () {
            if (!this.get('updatingValue')) {
                var val    = this.get('value') || []
                  , $input = this.$();

                $input.tagsinput('removeAll');
                Ember.$.each(val, function (i, v) {
                    $input.tagsinput('add', v);
                }.bind(this));
            }
        });
    }

  , updateValue: function (items) {
        this.set('updatingValue', true);
        this.set('value', items);
        this.set('updatingValue', false);
    }

  , didInsertElement: function ()  {
        this._super();

        var $input = this.$();

        $input.tagsinput({
            confirmKeys     : [13, 44, 32]
          , trimValue       : true
          , freeInput       : true
          , allowDuplicates : false
        });

        $input.on('itemAdded', function () {
            this.updateValue($input.tagsinput('items'));
        }.bind(this));

        $input.on('itemRemoved', function () {
            this.updateValue($input.tagsinput('items'));
        }.bind(this));

        $input.parent().find('.bootstrap-tagsinput > input').focus(function (e) {
            this.$(e.currentTarget).parent().addClass('active');
        }.bind(this)).blur(function (e) {
            this.$(e.currentTarget).parent().removeClass('active');
        }.bind(this));
    }
});
