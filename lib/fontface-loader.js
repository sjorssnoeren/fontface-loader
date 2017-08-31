const loaderUtils = require('loader-utils');

const createFontFace = require('../index');

module.exports = function loader(buffer) {
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};
  createFontFace(buffer).then((css) => {
    callback(null, css);
  });
};

module.exports.raw = true;
