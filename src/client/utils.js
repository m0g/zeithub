export const diff = (original, copy) => {
  let diffObj = {};

  Object.keys(original).forEach(key => {
    if (original[key] !== copy[key]) {
      diffObj[key] = copy[key];
    }
  });

  return diffObj;
};

