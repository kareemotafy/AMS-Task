const removeUndefinedValues = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop] !== undefined) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

module.exports = { removeUndefinedValues };
