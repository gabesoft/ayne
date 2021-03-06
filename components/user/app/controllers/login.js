import Validator from 'core/app/mixins/validator';
import Legend from 'core/app/mixins/legend';

export default Ember.Controller.extend(Validator, Legend, {
    authenticatePending: false,
    legendDefault: 'Enter your credentials',
    prevTransition: null,
    showForgotPassword: false,

    email: function () {
        return this.get('model.email');
    }.property('model.email'),

    init: function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.legendResetFields('email', 'password');
    },

    setup: function (model) {
        this.resetErrors();
        this.legend();
        this.set('model', model);
    },

    disableSubmit: function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending'),

    actions: {
        save: function () {
            this.set('authenticatePending', true);
            this.validate()
                .thenIf(function () {
                    this.auth.logout();
                    return this.api.login(this.get('model'));
                }.bind(this))
                .thenIf(function (response) {
                    var prev = this.get('prevTransition');

                    this.auth.login(response.data);
                    this.set('showForgotPassword', false);
                    if (prev) {
                        this.set('prevTransition', null);
                        prev.retry();
                    } else {
                        window.location.replace('/');
                    }
                }.bind(this))
                .catch(function (response) {
                    var json = response.json || response;

                    if (json.statusCode === 401 || json.statusCode === 404) {
                        this.set('showForgotPassword', true);
                        this.legend('Invalid credentials', 'error');
                    } else {
                        this.legend(json.message, 'error');
                    }
                }.bind(this))
                .finally(function () {
                    this.set('authenticatePending', false);
                }.bind(this));
        },

        redirectToSignup: function () {
            this.transitionToRoute('signup');
        }
    }
});
