export default Ember.Component.extend({
    layoutName : 'modal-dialog'
  , size       : 'medium'

  , show : function () {
        this.$('[data-reveal]').foundation('reveal', 'open');
    }

  , hide : function () {
        Ember.$('[data-reveal]').foundation('reveal', 'close');
    }

  , didInsertElement : function () {
        this.$(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
            this.sendAction('close');
        }.bind(this));

        this.show();

        if (this.get('closeTimeout')) {
            Ember.run.later(this.hide.bind(this), this.get('closeTimeout'));
        }
    }

  , willDestroyElement : function () {
        this.$().off();
        this.$(document).off('closed.fndtn.reveal');
    }
});
