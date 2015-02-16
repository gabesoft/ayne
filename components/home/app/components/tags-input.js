export default Ember.Component.extend({
    tagName           : 'input'
  , attributeBindings : ['type', 'data-role', 'value', 'valueAutocomplete' ]
  , type              : 'text'
  , value             : null
  , valueAutocomplete : null
  , 'data-role'       : 'tagsinput'
  , multiple          : true
  , placeholder       : null

  , init: function () {
        this._super();
        this.set('value', this.get('value') || []);
        this.addObserver('value', this, this.updateTags);
    }

  , updateTags: function () {
        var val    = this.get('value') || []
          , $input = this.$();

        $input.tagsinput('removeAll');
        Ember.$.each(val, function (i, v) {
            $input.tagsinput('add', v);
        }.bind(this));
    }

  , willDestroyElement: function () {
        this.$().tagsinput('destroy');
    }

  , getTypeaheadSource: function (data, initialize) {
        var local  = Ember.$.map(data || [], function (d) { return { value : d }; })
          , engine = new Bloodhound({
                value          : 'tags'
              , datumTokenizer : Bloodhound.tokenizers.obj.nonword('value')
              , queryTokenizer : Bloodhound.tokenizers.nonword
              , local          : local
              , limit          : 10
              , dupDetector    : function (remote, local) {
                    return remote.value === local.value;
                }
              , sorter : function (a, b) {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });

        if (initialize) {
            engine.initialize();
        }

        return engine;
    }

  , initializeTagsInput : function ($input) {
        return $input.tagsinput({
            confirmKeys     : [13, 44, 32]
          , trimValue       : true
          , freeInput       : true
          , allowDuplicates : false
        });
    }

  , initializeTypeahead : function ($input, engine) {
        return $input.typeahead({
            highlight  : true
          , hint       : true
          , minLength  : 1
          , autoselect : true
        }, {
            source     : engine.ttAdapter()
          , value      : 'tags'
          , displayKey : 'value'
          , valueKey   : 'value'
        }).on('keyup', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode !== 40 && keyCode !== 38) {
                $('.tt-dataset-0 .tt-suggestion').first().addClass('tt-cursor');
                $('.tt-dataset-1 .tt-suggestion').first().addClass('tt-cursor');
            }
        });
    }

  , didInsertElement: function ()  {
        this.get('valueAutocomplete').then(function (response) {

            var $input     = this.$()
              , engine     = this.getTypeaheadSource(response.data, true)
              , $tagsinput = null
              , $parent    = $input.parent();

            this.initializeTagsInput($input);

            $tagsinput = $input.tagsinput('input');

            this.initializeTypeahead($tagsinput, engine);

            $input.on('itemAdded', function (e) {
                if (this.get('value')) {
                    this.get('value').pushObject(e.item);
                }

                $tagsinput.typeahead('close');

                engine.get(e.item, function (suggestions) {
                    if(suggestions.length === 0 || suggestions[0].value !== e.item) {
                        engine.add([{ value: e.item }]);
                    }
                });
            }.bind(this));

            $input.on('itemRemoved', function (e) {
                if (this.get('value')) {
                    this.get('value').removeObject(e.item);
                }
            }.bind(this));

            $parent.find('.bootstrap-tagsinput input').blur(function () {
                $tagsinput.typeahead('close');
                $tagsinput.val('');
            });

            $parent.find('.bootstrap-tagsinput input').focus(function () {
                $parent.find('.bootstrap-tagsinput').addClass('active');
            }.bind(this)).blur(function () {
                $parent.find('.bootstrap-tagsinput').removeClass('active');
            }.bind(this));
        }.bind(this));
    }
});
