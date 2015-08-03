export default Ember.Component.extend({
    tagName: 'input',
    attributeBindings: ['type', 'data-role', 'value', 'valueAutocomplete'],
    type: 'text',
    value: null,
    valueAutocomplete: null,
    'data-role': 'tagsinput',
    multiple: true,
    blacklist: {},
    placeholder: null,

    init: function () {
        this._super();
        this.set('value', this.get('value') || []);
        this.addObserver('value', this, this.updateTags);
    },
    updateTags: function () {
        var val = this.get('value') || [],
            $input = this.$();

        $input.tagsinput('removeAll');
        Ember.$.each(val, function (i, v) {
            $input.tagsinput('add', v);
        }.bind(this));
    },
    willDestroyElement: function () {
        this.$().tagsinput('destroy');
    },
    getTypeaheadSource: function (data, initialize) {
        var local = Ember.$.map(data || [], function (d) {
                return {
                    value: d
                };
            }),
            engine = new Bloodhound({
                value: 'tags',
                datumTokenizer: Bloodhound.tokenizers.obj.nonword('value'),
                queryTokenizer: Bloodhound.tokenizers.nonword,
                local: local,
                limit: 10,
                dupDetector: function (remote, local) {
                    return remote.value === local.value;
                },
                sorter: function (a, b) {
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
    },
    filter: function (suggestions) {
        return suggestions.filter(function (item) {
            return !this.get('blacklist')[item.value];
        }.bind(this));
    },
    initializeTypeahead: function ($input, engine) {
        return $input.typeahead({
            highlight: true,
            hint: true,
            minLength: 1,
            autoselect: true
        }, {
            source: function (query, sync, async) {
                function _sync(suggestions) {
                    sync(this.filter(suggestions));
                }

                function _async(suggestions) {
                    async(this.filter(suggestions));
                }
                engine.search(query, _sync.bind(this), _async.bind(this));
            }.bind(this),
            value: 'tags',
            displayKey: 'value',
            valueKey: 'value',
            templates: {
                suggestion: function (data) {
                    var view = this.container.lookup('component:typeahead-suggestion');

                    view.set('deleteTag', function (tag) {
                        this.$().tagsinput('input').val('');
                        this.get('blacklist')[tag] = true;
                        this.sendAction('removeTag', tag);
                    }.bind(this));

                    view.set('value', data.value);
                    view.createElement();

                    return view.element.outerHTML;
                }.bind(this)
            }
        }).on('keyup', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode !== 40 && keyCode !== 38) {
                $('.tt-suggestion').first().addClass('tt-cursor');
            }
        });
    },
    initializeTagsInput: function (tags) {
        var $input = this.$(),
            engine = this.getTypeaheadSource(tags, true),
            $tagsinput = null,
            $parent = $input.parent();

        $input.tagsinput({
            confirmKeys: [13, 44, 32],
            trimValue: true,
            freeInput: true,
            allowDuplicates: false
        });

        $tagsinput = $input.tagsinput('input');

        this.initializeTypeahead($tagsinput, engine);

        $input.on('itemAdded', function (e) {
            if (this.get('value')) {
                this.get('value').pushObject(e.item.trim().replace(/^#/, ''));
            }

            $tagsinput.typeahead('close');

            engine.get(e.item, function (suggestions) {
                var found = suggestions.find(function (s) {
                    return s.value === e.item;
                });

                if (!found) {
                    engine.add([{
                        value: e.item
                    }]);
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
    },
    didInsertElement: function () {
        Ember.run.next(function () {
            this.get('valueAutocomplete').then(function (response) {
                this.initializeTagsInput(response.data);
            }.bind(this));
        }.bind(this));
    },
    actions: {
        deleteTag: function (tag) {
            console.log("tag = ", tag);
            this.$().tagsinput('input').val('');
            this.get('blacklist')[tag] = true;
            this.sendAction('removeTag', tag);
        }
    }
});