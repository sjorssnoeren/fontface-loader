@font-face loader for webpack
=========

![https://img.shields.io/circleci/project/github/sjorssnoeren/fontface-loader.svg](https://img.shields.io/circleci/project/github/sjorssnoeren/fontface-loader.svg)
![https://www.npmjs.com/package/fontface-loader](https://img.shields.io/npm/v/fontface-loader.svg)


As of today, implementing font-faces is still a cumbersome task to do. Most of us go to an online conversion site to make it happen. With the current state of JavaScript, we must be able to do it quicker and simpler. Welcome @font-face loader for Webpack.

This is all it takes to generate all your required formats. Just hand in a `.ttf` file. The other files as well as the matching CSS will be generated automatically (including `font-weight` and `font-style` properties).

```javascript
import './fonts/OpenSans-Light.ttf';
```

Generates the following:

```css
@font-face {
  font-family: 'Open Sans';
  font-weight: 300;
  font-style: normal;
  src: url(/dist/fonts/2c7d99f09db7c4c52ef7deb370977de8.eot);
  src: url(/dist/fonts/0b356dcc9963fde4a504d49564f51449.woff2) format('woff2'),
      url(/dist/fonts/9ff12f694e5951a6f51a9d63b05062e7.ttf)  format('truetype'),
      url(/dist/fonts/62e528f1c0050022d2d0be36d8247f9f.woff) format('woff');
}
```

## Installing

Firstly make sure you've installed webpack 3.0 or greater. (I've not yet tested this plugin with earlier versions). Run this line to install the fontface-loader. You may want to install css-loader and style-loader if you haven't done already so.

```
$ npm install fontface-loader --save
```

Add the following rules to your webpack configuration:

```javascript
{
  test: /^(?!.*\.generated\.ttf$).*\.ttf$/,
  use: ['css-loader', 'fontface-loader'],
}, {
  test: /\.generated.(ttf|eot|woff|woff2)$/,
  use: ['file-loader'],
},
```

Now you're good to go. Above you find the very minimal setup, it's however possible to customize using the webpack ExtractPlugin or file-loader options. For examples please view the examples directory.

### Configure output directory for fonts (using file-loader)

```javascript
{
  test: /\.generated.(ttf|eot|woff|woff2)$/,
  use: [{
    loader: 'file-loader',
    options: {
      outputPath: '/fonts/',
    },
  }],
},
```


## Usage

**Note: your fonts are generated in the directory next to it's origin and then passed to the output target.**

Usage is as follows:

```javascript
import './fonts/OpenSans-Light.ttf';
```

It should be possible to use fonts from other npm packages, however this is not tested yet.

## How it works

1. Your font is fetched through the webpack and then passed to the loader
2. The loader creates all font formats and places them next to the origin
3. The loader fetches metadata from the font and creates @font-face code
4. The loader passes CSS with correct URLs to the next loader in row (probably css-loader)

## Roadmap

* Add extensive options, to make it work for various developers.
* Make sure you'll be able to toggle which formats you want.
* Accept other file formats as input (.otf, firstly converted to ttf)
* Look for ways to enable async loading of the font-face
* Add tests
