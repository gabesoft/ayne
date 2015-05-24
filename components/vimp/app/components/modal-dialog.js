export default Ember.Component.extend({
    layoutName : 'modal-dialog'
  , size       : 'medium'

  , open : function () {
        this.$('.reveal-modal').foundation('reveal', 'open');
    }

  , close : function () {
        this.$('.reveal-modal').foundation('reveal', 'close');
    }

  , didInsertElement : function () {
        this.$(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
            this.sendAction('close');
        }.bind(this));

        this.open();
    }

  , willDestroyElement : function () {
        this.$().off();
        this.$(document).off('closed.fndtn.reveal');
    }
});
