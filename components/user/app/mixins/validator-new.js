import PSW_COMMON from 'data/common-passwords';

export default Ember.Mixin.create({
    invalid: false

  , init: function () {
        this._super();
        this.set('_validators', {});
        this.set('_errors', {});
        this.set('_haveErrors', {});
        this.set('error', {});
    }

  , resetErrors : function () {
        this.set('error', {});
        this.set('invalid', false);
    }

  , setValidator: function (type, srcField, dstField, validator, wait) {
        if (Array.isArray(srcField)) {
            srcField.forEach(function (field) {
                this.setValidator(type, field, dstField, validator, wait);
            }.bind(this));
            return;
        }

        var validators = this.get('_validators.' + dstField) || []
          , current    = {
                type                 : type
              , srcField             : srcField
              , dstField             : dstField
              , errorField           : 'error.' + dstField
              , _errorField          : '_errors.' + dstField
              , _errorTypeField      : '_errors.' + dstField + '.' + type
              , _validatorsField     : '_validators.' + dstField
              , _haveErrorsField     : '_haveErrors.' + dstField + '-' + type
              , id                   : validators.length + 1
              , fn                   : validator.bind(this)
              , toString             : function () { return type + '.' + dstField; }
            };

        validators.push(current);

        this.set(current._validatorsField, validators);
        this.set(current._errorField, this.get(current._errorField) || {});

        this.addObserver(srcField, this, function () {
            if (wait) {
                Ember.run.debounce(this, this.runValidator, current, wait);
            } else {
                this.runValidator(current);
            }
        });

        this.addObserver(current._errorTypeField, this, function () {
            var errors = this.get(current._errorField) || {};

            errors = Ember.$
               .map(errors, function (v) { return v; })
               .filter(Boolean)
               .sort(function (e1, e2) { return e1.id - e2.id; });

            this.set(current.errorField, (errors[0] || {}).value);
        });

        this.addObserver(current._haveErrorsField, this, function () {
            var have = this.get('_haveErrors')
              , any  = false;

            Ember.$.each(have, function (k, has) {
                any = any || has;
            });

            this.set('invalid', any);
        });
    }

  , setError: function (validator, value) {
        var result = null;

        if (value) {
            result = {
                id    : validator.id
              , value : value
            };
        }

        this.set(validator._errorTypeField, result);
        this.set(validator._haveErrorsField, Boolean(result));

        return result;
    }

  , validate: function () {
        var validators = this.get('_validators')
          , each       = Ember.$.each
          , promises   = [];

        each(validators, function (field, obj) {
            each(obj || {}, function (type, validator) {
                promises.push(this.runValidator(validator, true));
            }.bind(this));
        }.bind(this));

        return Ember.RSVP.all(promises).then(function (results) {
            this.set('invalid', results.filter(Boolean).length > 0);
            return !this.get('invalid');
        }.bind(this));
    }

  , runValidator: function (validator) {
        var args  = Array.prototype.slice.call(arguments, 1)
          , value = validator.fn.apply(this, args);

        if (value && value.then) {
            return value
               .then(function (v) { this.setError(validator, v); }.bind(this))
               .catch(function (err) {
                    console.log('validator failed ' + validator.toString(), err);
                    return this.setError(validator, null);
                }.bind(this));
        } else {
            return new Ember.RSVP.Promise(function (resolve) {
                resolve(this.setError(validator, value));
            }.bind(this));
        }
    }

  , validEmail : function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

  , validAlphaNumeric : function (text, lower) {
        var regex = lower ? /^[a-z0-9\-]*$/ : /^[a-zA-Z0-9\-]*$/;
        return regex.test(text);
    }

  , alphaNumericField: function (field, onlyLowercase) {
        this.setValidator('alphaNumericField', field, field, function () {
            var value = this.get(field)
              , valid = this.validAlphaNumeric(value, onlyLowercase)
              , msg   = onlyLowercase
                    ? 'please enter only lowercase letters or numbers in this field'
                    : 'please enter only letters or numbers in this field';

            return valid ? null : msg;
        });
    }

  , requiredField: function (field) {
        this.setValidator('requiredField', field, field, function (force) {
            var value = this.get(field);

            if ((!force && typeof value === 'undefined') || value) {
                return null;
            } else {
                return 'this is a required field';
            }
        });
    }

  , minLengthField: function (field, min, dstField) {
        dstField = dstField || field;

        this.setValidator('minLengthField', field, dstField, function (force) {
            var value = this.get(field);

            if ((!force && typeof value === 'undefined') || (value || '').length >= min) {
                return null;
            } else {
                return 'enter at least ' + min + ' characters in this field';
            }
        });
    }

  , emailField : function (field) {
        this.setValidator('emailField', field, field, function () {
            var value = this.get(field)
              , valid = this.validEmail(value);

            if (!value || valid) {
                return null;
            } else if (!valid) {
                return 'please enter a valid email address';
            }
        });
    }

  , uncommonPasswordField: function (field, dstField) {
        this.setValidator('uncommonPasswordField', field, dstField, function () {
            var value = this.get(field)
              , hash  = md5(value);
            return PSW_COMMON[hash] ? 'password too common' : null;
        });
    }

  , passwordFields: function (field1, field2, errorField) {
        this.setValidator('passwordFields', [field1, field2], errorField, function () {
            var value1 = this.getWithDefault(field1, '')
              , value2 = this.getWithDefault(field2, '');

            if (value1 === value2) {
                return null;
            } else {
                return 'passwords don\'t match';
            }
        });
    }
});
