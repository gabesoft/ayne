Ember.TextField.reopen({
    attributeBindings: [ 'aria-label' ]
});

var App = Ember.Application.create({
        LOG_TRANSITIONS: true,
        LOG_MODULE_RESOLVER: true,
        LOG_VIEW_LOOKUPS: true
    });

export default App;
