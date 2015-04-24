import Base from 'core/app/components/query-input-base';
export default Base.extend({
    triggerRegex  : /\b(\w{2,})$/
  , matchTemplate : function (value) {
        return value;
    }
  , matchReplace : function (value) {
        return value + ' ';
    }
});
