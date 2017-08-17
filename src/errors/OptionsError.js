'use strict';

class OptionsError extends Error {
  constructor (message, fileName, lineNumber) {
    super(message, fileName, lineNumber);

    const optionNames = message;

    if (Array.isArray(optionNames)) {
      let optionText;

      if (optionNames.length === 1) {
        optionText = `'${optionNames[0]}' option`;
      } else if (optionNames.length === 2) {
        optionText = `'${optionNames.join("' and '")}' options`;
      } else {
        const lastOption = optionNames[optionNames.length - 1];

        optionText = `'${optionNames.slice(0, -1).join("', '")}', and '${lastOption}' options`;
      }

      this.message = `Expected ${optionText} to exist - unable to perform validation.`;
    }

  }
}

module.exports = OptionsError;
