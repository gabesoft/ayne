function makeHash(promises) {
    var hash = Object.keys(promises).reduce(function (acc, name) {
        acc[name] = promises[name]()
            .then(function (response) {return response.data || [];})
            .catch(function () {return [];});
        return acc;
    }, {});

    return Ember.RSVP.hash(hash);
}

export default Ember.Route.extend({
    queryParams: {
        search: {
            refreshModel: true,
            replace: false
        }
    },
    model: function (params) {
        return makeHash({
            plugins: this.api.getVplugs.bind(this.api, params),
            mostStarred: this.api.getMostStarred.bind(this.api),
            lastUpdated: this.api.getLastUpdated.bind(this.api)
        });
    },
    actions: {
        showModal: function (name, model) {
            return this.api.getVplug(model.id)
                .then(function (response) {
                    return this.render(name, {
                        outlet: 'modal',
                        into: 'application',
                        model: response.data
                    });
                }.bind(this));
        },
        hideModal: function () {
            function removeHash() {
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }

            removeHash();
            return this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });
        }
    }
});