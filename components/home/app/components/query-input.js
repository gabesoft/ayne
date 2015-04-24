import Base from 'core/app/components/query-input-base';
export default Base.extend({
    triggerRegex  : /\B#([\-\w]*)$/
  , matchTemplate : function (value) {
        return value;
    }
  , matchReplace : function (value) {
        return '#' + value;
    }
});
