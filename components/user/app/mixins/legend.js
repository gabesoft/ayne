export default Ember.Mixin.create({
    init : function () {
        this._super();

        this.set('legendText', this.get('legendDefault') || 'Legend default not set');
        this.set('legendClass', '');
        this.set('legendIcon', '');
        this.set('legendPending', false);
        this.set('errorIcon', 'fa-exclamation-circle');
        this.set('successIcon', 'fa-check-square-o');
        this.set('warningIcon', 'fa-warning');
    }

  , legendResetFields: function () {
        var args = Array.prototype.slice.call(arguments);
        Ember.$.each(args, function (i, field) {
            this.addObserver(field, this, function () {
                if (!this.get('legendPending')) {
                    this.legend();
                }
            });
        }.bind(this));
    }

  , legend : function (text, type, timeout) {
        text = text || this.get('legendDefault');

        if (this.runId) {
            Ember.run.cancel(this.runId);
            this.runId = null;
        }

        if (timeout) {
            this.set('legendPending', true);
            this.runId = Ember.run.later(this, function () {
                this.legend();
                this.set('legendPending', false);
            }, timeout);
        }

        this.set('legendText', text);
        this.set('legendClass', type);
        this.set('legendIcon', this.getWithDefault(type + 'Icon', ''));
    }
});
