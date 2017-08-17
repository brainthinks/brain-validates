'use strict';

class ArgumentTypeError extends Error {
  constructor (message, fileName, lineNumber) {
    super('', fileName, lineNumber);

    const {
      type = 'type',
      name,
      value,
      acceptedTypes,
    } = message;

    let acceptedTypesText;

    if (acceptedTypes.length === 1) {
      acceptedTypesText = acceptedTypes[0];
    } else if (acceptedTypes.length === 2) {
      acceptedTypesText = acceptedTypes.join(' or ');
    } else {
      const lastType = acceptedTypes[acceptedTypes.length - 1];

      acceptedTypesText = `${acceptedTypes.slice(0, -1).join(', ')}, or ${lastType}`;
    }

    let typeText;

    switch (type) {
      case 'instance': {
        typeText = 'to be an instance of';
        break;
      }
      default: {
        typeText = 'to be of type';
      }
    }

    this.message = `Expected the argument '${name}' ${typeText} ${acceptedTypesText}, but it was of type '${typeof value}'.`;
  }
}

module.exports = ArgumentTypeError;
