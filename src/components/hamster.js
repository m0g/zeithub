const Vue = require('vue');

module.exports = context => {
  return new Vue({
    template: `
      <div>
        <h1>Upload your hamster xml here</h1>

        <form action="/hamster" method="post" enctype=multipart/form-data>
          <input type="file" name="xml" />
          <input type="submit" value="upload" />
        </form>
      </div>
    `
  });
};
