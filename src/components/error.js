const Vue = require('vue');

module.exports = context => {
  return new Vue({
    data: context,
    template: `
      <h1>Fatal error</h1>
    `
  });
};
