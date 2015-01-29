import AppRouteBase from  'core/app/routes/application';

export default AppRouteBase.extend({
    init: function () {
        this._super();
        this.addObserver('loggedIn', this, function () {
            if (!this.get('loggedIn')) {
                this.transitionTo('login');
            }
        });
    }
});
