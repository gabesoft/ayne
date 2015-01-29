import Api from 'core/app/services/api';

export default Api.extend({
    resetPassword: function (data) {
        return this.runPost('/api/email/reset-password', data);
    }

  , saveProfile: function (data) {
        return this.runPost('/api/profile', data);
    }

  , setPassword: function (data) {
        return this.runPost('/api/password', data);
    }

  , getProfile: function () {
        return this.runGet('/api/profile');
    }

  , logout: function () {
        return this.runPost('/api/logout');
    }

  , login: function (data) {
        return this.runPost('/api/login', data);
    }

  , signup : function (data) {
        return this.runPost('/api/signup', data);
    }

  , checkDisplayName: function (name) {
        return this.runGet('/api/username/check/' + encodeURIComponent(name));
    }
});
