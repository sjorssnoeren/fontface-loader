const fs = require('fs');
const path = require('path');

const Promise = require('bluebird');

const ttfInfo = require('ttfinfo');
const ttf2eot = require('ttf2eot');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');

const transformers = {
  // All transformers take an Uint8Array as input and output
  // an object. The result object will include the transformed buffer
  eot: ttf2eot,
  woff: ttf2woff,
  woff2: ttf2woff2,
  ttf: (array) => {
    return new Buffer(array);
  },
};

const transformFontTo = (ext, ttfBuffer) => {
  const func = transformers[ext];
  const result = func(new Uint8Array(ttfBuffer));
  return new Buffer(result.buffer);
};

const writeTransformedFonts = (dirname, filename, ttfBuffer) => {
  const writeFile = Promise.promisify(fs.writeFile);

  const promises = Object.keys(transformers).map((ext) => {
    const filepath = `${dirname}/${filename}.generated.${ext}`;

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

const parseFontName = (nameTableArray) => {
  // Start searching for font name at position 1
  for (let i = 1; i < Object.keys(nameTableArray).length; i += 1) {
    const string = nameTableArray[String(i)];

    // Reached end of low table indexes
    // There may be higher indexes further, but those are not likely to include name
    if (string == null) {
      return null;
    }

    if (string !== '' && string.length > 2) {
      return string;
    }
  }
  return null;
};

const createCSSFontFaceTemplate = (filename, ttfBuffer) => {
  const ttfInfoPromised = Promise.promisify(ttfInfo);

  return ttfInfoPromised(ttfBuffer).then((info) => {
    // Try to parse fontFamily, if returns null use the filename as familyName
    const fontFamily = parseFontName(info.tables.name) || filename;

    // Try to parse fontWeight, if null use default weight 400
    const fontWeight = info.tables['OS/2'].weightClass || 400;

    const fontStyle = info.tables.post.italicAngle === 0 ? 'normal' : 'italic';

    return `
@font-face {
  font-family: '${fontFamily}';
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  src: url('./${filename}.generated.eot');
  src: url('./${filename}.generated.woff2') format('woff2'),
      url('./${filename}.generated.ttf')  format('truetype'),
      url('./${filename}.generated.woff') format('woff');
}
    `;
  });
};

const createFontFace = function createFontFace(filePath, ttfBuffer) {
  const dirname = path.dirname(filePath);
  const filename = path.basename(filePath, '.ttf');

  return writeTransformedFonts(dirname, filename, ttfBuffer).then(() => {
    return createCSSFontFaceTemplate(filename, ttfBuffer);
  });
};

module.exports = createFontFace;
