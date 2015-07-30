export default Ember.Component.extend({
    layoutName: 'plug-list',
    classNames: ['plug-list'],

    actions: {
        showModal: function (name, model) {
            this.sendAction('showModal', name, model);
        }
    }
});