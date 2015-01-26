import ApiBase from 'core/app/services/api-base';

export default ApiBase.extend({
    getProfile: function () {
        return this.runGet('/api/profile');
    }

  , logout: function () {
        return this.runPost('/api/logout');
    }
});
