export default Ember.View.extend({
    accordionActions : {
        'most-starred' : 'updateMostStarred'
      , 'last-updated' : 'updateLastUpdated'
    }
  , didInsertElement : function () {
        this.$().find('.accordion').on('toggled', function (e, targets) {
            var $el    = $(targets[0])
              , id     = $el.attr('id')
              , active = $el.hasClass('active')
              , action = this.accordionActions[id];
            this.sendControllerAction(action, active);

            if (active) {
                Object.keys(this.accordionActions).forEach(function (action) {
                    if (action !== id) {
                        this.sendControllerAction(this.accordionActions[action], false);
                    }
                }.bind(this));
            }
        }.bind(this));
    }
  , willDestroyElement : function () {
        this.$().off();
        this.$().find('.accordion').off();
    }
  , sendControllerAction : function (name, value) {
        this.get('controller').send(name, value);
    }
});
