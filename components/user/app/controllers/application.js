import App from 'app';
import Gravatar from 'mixins/gravatar';

App.ApplicationController = Ember.Controller.extend(Gravatar, {
    profilePhotoSize: 64
});
