'use strict';

const Validator = require('brain-validates');

const validator = Validator.factory();

// 3 arguments
validator.register('maxLength', (value, { maxLength }) => {
  if (maxLength === undefined) {
    throw new Validator.errors.OptionsError('maxLength');
  }

  if (!value || value.length !== maxLength) {
    throw new Error('too beaucoup');
  }
}, (error, value, validatorName, { maxLength }) => {
  if (error.toString() === 'too beaucoup') {
    return `Expected ${value} to have a length no greater than ${maxLength}.`;
  }

  if (error instanceof NullValueError) {
    return 'You must specify a value to validate.';
  }

  return `Error while validating ${value} for a maximum length of ${maxLength}`;
});

// 2 arguments
validator.register('maxLength', {
  validator: ({ maxLength }, value) => {
    if (!value || value.length > maxLength) {
      throw new Error('too beaucoup');
    }
  },
  generateErrorMessage: (error, { maxLength }, value) => {
    if (error.toString() === 'too beaucoup') {
      return `Expected ${value} to have a length no greater than ${maxLength}.`;
    }

    if (error instanceof NullValueError) {
      return 'You must specify a value to validate.';
    }

    return `Error while validating ${value} for a maximum length of ${maxLength}`;
  },
});

// 1 argument
validator.register({
  name: 'maxLength',
  validator: ({ maxLength }, value) => {
    if (!value || value.length > maxLength) {
      throw new Error('too beaucoup');
    }
  },
  generateErrorMessage: (error, { maxLength }, value) => {
    if (error.toString() === 'too beaucoup') {
      return `Expected ${value} to have a length no greater than ${maxLength}.`;
    }

    if (error instanceof NullValueError) {
      return 'You must specify a value to validate.';
    }

    return `Error while validating ${value} for a maximum length of ${maxLength}`;
  },
});


// 3 arguments
const validation = validator.validate('another brainthinks production', 'maxLength', { maxLength: 80 });
// 2 arguments
const validation = validator.validate('another brainthinks production', {
  name: 'maxLength',
  options: { maxLength: 80 },
});

// multiple validations
const validation = validator.validate('another brainthinks production', [
  {
    name: 'minLength',
    options: { minLength: 30 },
  },
  {
    name: 'maxLength',
    options: { maxLength: 80 },
  },
]);


// Boolean indicating value validity
validation.valid;
validation.isValid();
// Get an array containing all error messages.
validation.errors;
validation.getErrors();
// Only get the first error.  if there were no errors, this will return null
validation.error;
validation.getError();
// get the value that was validated
// be careful! if you validated an object, you could mutate it here!
validation.value;
validation.getValue();
// get the name of the first validator that was used.
validation.validatorName;
validation.getValidatorName();
// get the names of all validators used
validation.validatorNames;
validation.getValidatorNames();
// get the options that were passed in to the validator
validation.validatorOptions;
validation.getValidatorOptions();
// This will let you know that we stopped checking for more errors
validation.limitReached();
