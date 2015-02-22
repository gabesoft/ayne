export default Ember.ArrayController.extend({
    needs   : ['index']
  , actions : {
        runQuery: function (query) {
            this.get('controllers.index').send('runQuery', query);
        }
    }
});
