var keys = {
        BACKSPACE   : 8
      , TAB         : 9
      , ENTER       : 13
      , SHIFT       : 16
      , CTRL        : 17
      , ALT         : 18
      , PAUSE_BREAK : 19
      , CAPS_LOCK   : 20
      , ESCAPE      : 27
      , PAGE_UP     : 33
      , PAGE_DOWN   : 34
      , END         : 35
      , HOME        : 36
      , LEFT_ARROW  : 37
      , UP_ARROW    : 38
      , RIGHT_ARROW : 39
      , DOWN_ARROW  : 40
      , INSERT      : 45
      , DELETE      : 46
    };

export default Ember.Mixin.create({
    init : function () {
        this._super();
        this.set('keys', keys);
    }
});
