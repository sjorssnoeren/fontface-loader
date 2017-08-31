@font-face loader for webpack
=========

**I am aware that this loader might be out of scope for webpack, however I'm still wondering what it might do for the future.**
*This project is currently a work in progress and I would love to get some feedback.*

As of today, implementing font-faces is still a cumbersome task to do. Most of us go to an online conversion site to make it happen. With the current state of JavaScript, we must be able to do it quicker and simpler. Welcome @font-face loader for Webpack.

This is all it takes to generate all your required formats. Just hand in a .ttf file and the other files as well as the matching CSS is generated automatically (including `font-weight` and `font-style` properties). Change the extension of a `.ttf` file to `.webfont` to make sure it get's compiled by webpack.

```javascript
import './fonts/OpenSans-Light.webfont';
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

Firstly make sure you've installed webpack 3.0 or greater. (I've not yet tested this plugin with earlier versions)

```
$ npm install fontface-loader --save
```

Add the following rules to your webpack configuration:

```javascript
{
  test: /\.webfont$/,
  use: ['css-loader', 'fontface-loader'],
}, {
  test: /\.(ttf|eot|woff|woff2)$/,
  use: ['file-loader'],
},
```

Now you're good to go. Above you find the very minimal setup, it's however possible to customize using the webpack ExtractPlugin or file-loader options. An example of this usage can be found under the examples directory.

## Usage

**Note: your fonts are generated in the directory next to it's origin and then passed to the output target. You can use all formats manually as well.**

For now, no advanced options are available. I've chosen to change the extension of `.ttf` files to `.webfont` to make sure the `.ttf` loader works properly for importing the real `.ttf`. A `.webfont` file contains the same contents as the `.ttf` file to make this loader work.

Usage is as follows:

```javascript
import './LOCATION_TO/YOUR_FONT.webfont';
```

It should be possible to use fonts from other npm packages, however this is not tested yet.

## How it works

1. Your font is fetched through the webpack and then passed to the loader
2. The loader creates all font formats and places them next to the origin
3. The loader fetches metadata from the font and creates @font-face code
4. The loader passes CSS with correct URLs to the next loader in row (probably css-loader)

## Roadmap

* Maybe make use of caching mechanisms of webpack
* Add extensive options, to make it work for various developers. Make sure you'll be able to toggle which formats you want.
* Accept .otf files as input (firstly converted to ttf)
* Look for ways to enable async loading of the font-face
* Add tests
