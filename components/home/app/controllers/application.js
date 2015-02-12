import AppControllerBase from 'core/app/controllers/application';

export default AppControllerBase.extend(Ember.Evented, {
    headerIcon : 'fa-skyatlas'
  , urlModel   : {}
  , actions    : {
        urlUpdated: function (data) {
            this.trigger('url-updated', data);
        }
      , urlDeleted: function (data) {
            this.trigger('url-deleted', data);
        }
    }
});
