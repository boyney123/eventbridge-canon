export const clearValues = (obj) => {
  return Object.keys(obj).reduce((clearedValues, key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      clearedValues[key] = clearValues(obj[key]);
    } else {
      clearedValues[key] = '';
    }
    return clearedValues;
  }, {});
};
