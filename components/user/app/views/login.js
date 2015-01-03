import App from 'app';

App.LoginView = Ember.View.extend({
    keyDown: function (e) {
        this.get('controller').send('updateKey', e.keyCode);
    }
});
