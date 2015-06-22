export default Ember.Controller.extend({
    copyCloneUrlClass   : 'fa-copy'
  , copyCloneUrlTitle   : 'Copy github clone url to clipboard'
  , enabledCloneUrlCopy : false

  , author : function () {
        return this.get('model.author.name')
        || this.get('model.author.login')
        || this.get('model.author');
    }.property('model')
  , aboveThreshold : function () {
        return this.get('model.isPlugin') > 0.3;
    }.property('isPlugin')
  , createdAt : function () {
        return moment(this.get('model.githubCreatedAt')).fromNow();
    }.property('model.githubCreatedAt')
  , pushedAt : function () {
        return moment(this.get('model.githubPushedAt')).fromNow();
    }.property('model.githubPushedAt')
});
