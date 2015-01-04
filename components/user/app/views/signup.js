import App from 'app';

App.SignupView = Ember.View.extend({
    keyDown: function (e) {
        this.get('controller').send('updateKey', e.keyCode);
    }
});
