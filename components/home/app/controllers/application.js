import AppControllerBase from 'core/app/controllers/application';

export default AppControllerBase.extend({
    headerIcon : 'fa-skyatlas'
  , urlModel   : {}
  , actions    : {
        urlUpdated: function (data) {
            console.log('url-updated', data);
        }
      , urlDeleted: function (data) {
            console.log('url-deleted', data);
        }
    }
});
