function VplugController (ApiService) {
    this.plugins = [];

    ApiService
       .loadPlugins()
       .success(function (plugins) {
            this.plugins = plugins;
        }.bind(this))
       .error(function () {
            console.log('error', arguments);
        });
}

module.exports = [ 'ApiService', VplugController ];
