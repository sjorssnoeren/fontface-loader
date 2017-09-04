const loaderUtils = require('loader-utils');

const createFontFace = require('./create');

module.exports = function loader(buffer) {
  const callback = this.async();

  /* eslint-disable no-unused-vars */
  const config = loaderUtils.getOptions(this) || {};

  createFontFace(this.resourcePath, buffer).then((css) => {
    callback(null, css);
  });
};

module.exports.raw = true;
