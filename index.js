const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');


const transformers = {
  // All transformers take an Uint8Array as input and output
  // an object. The result object will include the transformed buffer
  eot: require('ttf2eot'),
  woff: require('ttf2woff'),
  woff2: require('ttf2woff2'),
};

const transformFontTo = (ext, ttfBuffer) => {
  const func = transformers[ext];
  const result = func(new Uint8Array(ttfBuffer));
  return new Buffer(result.buffer);
};

const writeTransformedFonts = (dirname, filename, ttfBuffer) => {
  const writeFile = Promise.promisify(fs.writeFile);

  const promises = Object.keys(transformers).map((ext) => {
    const filepath = `./${dirname}/${filename}.${ext}`;

    // Skips transform and write actions when a font file already exists
    const exists = fs.existsSync(filepath);
    if (exists === true) {
      return Promise.resolve();
    }

    const buffer = transformFontTo(ext, ttfBuffer);
    return writeFile(filepath, buffer);
  });

  return Promise.all(promises);
};

const createCSSFontFaceTemplate = (dirname, filename, styles) => {
  return `
    @font-face {
      font-family: ${styles.fontFamily};
      font-weight: ${styles.fontWeight};
      font-style: ${styles.fontStyle};
      src: url('${dirname}/${filename}.eot');
      src: url('${dirname}/${filename}.woff2') format('woff2'),
          url('${dirname}/${filename}.woff') format('woff'),
          url('${dirname}/${filename}.ttf')  format('truetype');
    }
  `;
};

const fontfeest = function fontfeest(file, fontFamily, fontWeight = 400, fontStyle = 'normal') {
  const dirname = path.dirname(file);
  const filename = path.basename(file, '.ttf');
  const ttfBuffer = fs.readFileSync(file);

  return writeTransformedFonts(dirname, filename, ttfBuffer).then(() => {
    const style = { fontFamily, fontWeight, fontStyle };
    return createCSSFontFaceTemplate(dirname, filename, style);
  });
};

module.exports = fontfeest;

fontfeest('./fixtures/OpenSans-Light.ttf', 'Open Sans', 300).then((css) => {
  console.log(css);
});
