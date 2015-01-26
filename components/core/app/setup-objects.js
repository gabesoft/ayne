/**
* Contine the promise chain only if the value returned from the
* last then call is a non falsy value
* @param {function} onFulfillment
* @param {function} onRejection
* @param {string} label - optional string for labeling the promise
*/
Ember.RSVP.Promise.prototype.thenIf = function (onFulfillment, onRejection, label) {
    return this.then(function (value) {
        if (value) {
            return onFulfillment(value);
        } else {
            return false;
        }
    }, onRejection, label);
};

Ember.RSVP.configure('onerror', function (error) {
    if (error instanceof Error) {
        Ember.Logger.assert(false, error);
        Ember.Logger.error(error.stack);
    }
});

Ember.TextField.reopen({
    attributeBindings: [ 'aria-label' ]
});
