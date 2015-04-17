function ApiService ($http) {
    this.$http = $http;
}

ApiService.prototype.loadPlugins = function () {
    return this.$http.get('/api/vplugs');
};

module.exports = [ '$http', function ($http) {
    return new ApiService($http);
}];
