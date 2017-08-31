const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');

const ttfInfo = require('ttfinfo');

const transformers = {
  // All transformers take an Uint8Array as input and output
  // an object. The result object will include the transformed buffer
  woff: require('ttf2woff'),
  woff2: require('ttf2woff2'),
};

const transformFontTo = (ext, ttfBuffer) => {
  const func = transformers[ext];
  const result = func(new Uint8Array(ttfBuffer));
  return new Buffer(result.buffer);
};

const createFontFormatBuffers = (ttfBuffer) => {
  return Object.keys(transformers).reduce((result, ext) => {
    return Object.assign(result, { [ext]: transformFontTo(ext, ttfBuffer) });
  }, {});
};

const createCSSFontFaceTemplate = (buffers) => {
  const ttfInfoPromised = Promise.promisify(ttfInfo);

  return ttfInfoPromised(buffers.ttf).then((info) => {
    const fontFamily = info.tables['name']['1'];
    if (fontFamily == null) {
      throw new Error('.ttf file not compatible with fontface-loader. Please use a .ttf file with valid metadata');
    }

    const fontWeight = info.tables['OS/2'].weightClass || 400;
    const fontStyle  = info.tables['post'].italicAngle === 0 ? 'normal' : 'italic';

    const woffString = buffers.woff.toString('base64');
    const woff2String = buffers.woff2.toString('base64');

    return `
@font-face {
  font-family: '${fontFamily}';
  font-weight: ${fontWeight};
  font-style: '${fontStyle}';
  src: url(data:application/font-woff2;charset=utf-8;base64,${woff2String}) format('woff2'),
      url(data:application/font-woff;charset=utf-8;base64,${woffString}) format('woff');
}
    `;
  });
};

const createFontFace = function createFontFace(ttfBuffer) {
  const buffers = Object.assign(createFontFormatBuffers(ttfBuffer), { ttf: ttfBuffer });
  return createCSSFontFaceTemplate(buffers);
};

module.exports = createFontFace;
