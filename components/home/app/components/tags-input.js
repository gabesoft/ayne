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
        this.set('value', []);
        this.addObserver('value', this, function () {
            var val    = this.get('value') || []
              , $input = this.$();

            $input.tagsinput('removeAll');
            Ember.$.each(val, function (i, v) {
                $input.tagsinput('add', v);
            }.bind(this));
        });
    }

  , didInsertElement: function ()  {
        this._super();

        var $input  = this.$()
          , $parent = $input.parent();

        var engine = new Bloodhound({
                name           : 'tags'
              , local          : [ 'programming', 'javascript', 'java', 'haskell', 'operations', 'documentation', 'front-end', 'back-end', 'server', 'regular-expressions', 'regex', 'ruby', 'foundation', 'bootstrap', 'less', 'software', 'rails', 'vim', 'bash', 'linux', 'web', 'css', 'sass' ].map(function(x) { return { name: x }; })
              , datumTokenizer : Bloodhound.tokenizers.obj.whitespace('name')
              , queryTokenizer : Bloodhound.tokenizers.whitespace
            });

        engine.initialize();
        $input.tagsinput({
            confirmKeys     : [13, 44, 32]
          , trimValue       : true
          , freeInput       : true
          , allowDuplicates : false
          , typeaheadjs     : {
                source     : engine.ttAdapter()
              , name       : 'tags'
              , displayKey : 'name'
              , valueKey   : 'name'
              , highlight  : true
              , hint       : false
              , minLength  : 2
            }
        });

        // TODO: clean this up
        //       set the autocomplete datasource

        $input.on('itemAdded', function (e) {
            this.get('value').pushObject(e.item);
            $input.tagsinput('input').typeahead('close');
        }.bind(this));

        $input.on('itemRemoved', function (e) {
            this.get('value').removeObject(e.item);
        }.bind(this));

        $parent.find('.bootstrap-tagsinput input').blur(function (e) {
            $input.tagsinput('input').typeahead('close');
            $input.tagsinput('input').val('');
        });

        $parent.find('.bootstrap-tagsinput input').focus(function (e) {
            $parent.find('.bootstrap-tagsinput').addClass('active');
        }.bind(this)).blur(function (e) {
            $parent.find('.bootstrap-tagsinput').removeClass('active');
        }.bind(this));
    }
});
