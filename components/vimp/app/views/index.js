export default Ember.View.extend({
    didInsertElement : function () {
        this.$().on('click', '[href=#most-starred]', this.mostStarredClick.bind(this));
        this.$().on('click', '[href=#last-updated]', this.lastUpdatedClick.bind(this));
    }
  , willDestroyElement : function () {
        this.$().off();
    }
  , mostStarredClick : function (e) {
        var $li = $(e.currentTarget).closest('li');
        this.sendControllerAction('updateMostStarred', !$li.hasClass('active'))
    }
  , lastUpdatedClick : function (e) {
        var $li = $(e.currentTarget).closest('li');
        this.sendControllerAction('updateLastUpdated', !$li.hasClass('active'))
    }
  , sendControllerAction : function (name, value) {
        this.get('controller').send(name, value);
    }
});
