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
};
