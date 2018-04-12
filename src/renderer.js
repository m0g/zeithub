const fs = require('fs');
const { createRenderer } = require('vue-server-renderer');

const renderer = createRenderer({
  template: fs.readFileSync('./src/index.template.html', 'utf-8')
});

module.exports = renderer;
