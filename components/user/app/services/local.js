export default Ember.Object.extend({
    wrap: function (data) {
        return JSON.stringify({
            value : data
          , date  : Date.now
        });
    }

  , unwrap: function (key) {
        var cargo = localStorage[key];
        var data = {};

        try {
            data = JSON.parse(cargo || "{}");
        } catch(e) {
            data = {};
        }

        return data;
    }

  , set: function (key, value) {
        localStorage[key] = this.wrap(value);
    }

  , get: function (key) {
        return this.unwrap(key).value;
    }

  , getDefaultValue: function (key, defaultValue) {
        var value = this.unwrap(key).value;
        return (typeof value === 'undefined') ? defaultValue : value;
    }

  , remove: function (key) {
        delete localStorage[key];
    }

  , has: function (key) {
        return (typeof this.unwrap(key).value !== 'undefined');
    }
});
