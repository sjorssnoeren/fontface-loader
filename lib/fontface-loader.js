const loaderUtils = require('loader-utils');
const path = require('path');

const createFontFace = require('./create');

module.exports = function loader(buffer) {
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};

  createFontFace(this.resourcePath, buffer).then((css) => {
    callback(null, css);
  });
};

module.exports.raw = true;
