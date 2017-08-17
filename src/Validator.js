'use strict';

const Validation = require('./Validation');
const errors = require('./errors/');

class Validator {
  static factory (definitions = {}, options = {}) {
    return new Validator(definitions, options);
  }

  constructor (definitions, options) {
    // @todo - use a weakMap to make this a private instance property
    this.validators = {};

    this.registerMany(definitions);
  }

  register (name, validator, generateErrorMessage = (error) => error) {
    ({
      name,
      validator,
      generateErrorMessage,
    }) = registerValidateArguments(name, validator, generateErrorMessage);

    this.validators[name] = {
      validator,
      generateErrorMessage,
    };

    return this;
  }

  registerMany (definitions = []) {
    if (Array.isArray(definitions)) {
      const definitionCount = definitions.length;

      for (let i = 0; i < definitionCount; i++) {
        this.register(definition[i]);
      }

      return this;
    }

    if (typeof definitions === 'object') {
      const definitionNames = Object.keys(definitions);
      const definitionCount = definitionNames.length;

      for (let i = 0; i < definitionCount; i++) {
        const definitionName = definitionNames[i];
        const definition = definitions[definitionName];

        this.register(definitionName, definition);
      }

      return this;
    }

    throw new errors.ArgumentTypeError({
      name: 'definitions',
      value: definitions,
      acceptedTypes: ['array', 'object'],
    });
  }

  // Allow the caller to override the 'limit' property of this Validator instance
  validate (value, name, options = {}, validatorOptions = {}, validation) {
    if (typeof name === 'string') {
      if (!this.validators[name]) {
        throw new errors.UnregisteredValidatorError(name);
      }

      if (!validatorOptions || typeof validatorOptions !== 'object') {
        throw new errors.ArgumentTypeError({
          name: 'validatorOptions',
          value: validatorOptions,
          acceptedTypes: ['object'],
        });
      }

      if (validation && !(validation instanceof Validation)) {
        throw new errors.ArgumentTypeError({
          type: 'instance',
          name: 'validation',
          value: validation,
          acceptedTypes: ['Validation'],
        });
      }

      // This allows validateMany to use this method because it needs to pass
      // the validation instance.
      if (!validation) {
        const limit = validatorOptions.hasOwnProperty('limit')
          ? validatorOptions.limit
          : this.limit;

        validation = Validation.factory(value, { limit });
      }

      return validation.validate(name, this.validators[name], options);
    }

    if (Array.isArray(name)) {
      return this.validateMany(value, name, validatorOptions);
    }

    if (typeof name === 'object') {
      // Shift the arguments down one
      validation = validatorOptions;
      validatorOptions = options;
      options = name.options;
      name = name.name;

      return this.validate(value, name, options, validatorOptions, validation);
    }

    throw new errors.ArgumentTypeError({
      name: 'name',
      value: name,
      acceptedTypes: ['string', 'array', 'object'],
    });
  }

  validateMany (value, validationList = [], validatorOptions = {}) {
    if (!Array.isArray(validationList)) {
      throw new errors.ArgumentTypeError({
        name: 'validationList',
        value: validationList,
        acceptedTypes: ['array'],
      });
    }

    const validationListCount = validationList.length;

    let validation;

    for (let i = 0; i < validationListCount; i++) {
      const validationEntry = validationList[i];

      if (typeof validationEntry !== 'object' || Array.isArray(validationEntry)) {
        throw new TypeError(`Expected 'validationList' entries to be objects, but the entry at index ${i} is of type ${typeof validationEntry}`);
      }

      const {
        name,
        options,
      } = validationEntry;

      validation = this.validate(value, name, options, validatorOptions, validation);

      if (validation.limitReached()) {
        break;
      }
    }

    return validation;
  }
}

Validator.errors = errors;

function registerValidateArguments (name, validator, generateErrorMessage) {
  if (typeof name === 'object') {
    ({
      name
      validator,
      generateErrorMessage,
    } = name);

    return registerValidateArguments(name, validator, generateErrorMessage);
  }

  if (typeof name !== 'string') {
    throw new errors.ArgumentTypeError({
      name: 'name',
      value: name,
      acceptedTypes: ['string'],
    });
  }

  if (typeof validator === 'object') {
    ({
      validator,
      generateErrorMessage,
    } = validator);

    return registerValidateArguments(name, validator, generateErrorMessage);
  }

  if (typeof validator !== 'function') {
    throw new errors.ArgumentTypeError({
      name: 'validator',
      value: validator,
      acceptedTypes: ['function'],
    });
  }

  if (typeof generateErrorMessage !== 'function') {
    throw new errors.ArgumentTypeError({
      name: 'generateErrorMessage',
      value: generateErrorMessage,
      acceptedTypes: ['function'],
    });
  }

  return {
    name,
    validator,
    generateErrorMessage,
  }
}

module.exports = Validator;
