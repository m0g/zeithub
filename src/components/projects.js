const Vue = require('vue');

module.exports = context => {
  return new Vue({
    data: context,
    template: `
      <ul>
        <li v-for="project in projects">{{project.name}}</li>
      </ul>
    `
  });
};
