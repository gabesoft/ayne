import Validator from 'core/app/mixins/validator';
import Legend from 'user/app/mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    model: {}
  , favicon: function () {
        var href = this.get('model.href');
        return 'http://www.google.com/s2/favicons?domain_url=' + encodeURIComponent(href);
    }.property('model.href')
  , name: function () {
        // TODO: use title here
        var href = this.get('model.href');
        return (href || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }.property('model.href')
});
