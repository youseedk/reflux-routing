module.exports = {
  zipObject(a, b) {
    const result = {};

    if (a.length !== b.length) {
      throw String('object and value arrays must be equal length');
    }

    a.forEach((key, index) => {
      result[key] = b[index];
    });

    return result;
  },

  tokenize(input) {
    const tokens = input
      .replace(/^\/?/, '')
      .replace(/\/?$/, '')
      .split('/');

    // If the input is an empty string, the first token is an empty string,
    // when really this means that we should not have any tokens
    if (tokens.length === 1 && tokens[0] === '') { return []; }
    return tokens;
  },

  findParam(token, params) {
    return params.find(p => p.name === token.substring(1));
  },
};
