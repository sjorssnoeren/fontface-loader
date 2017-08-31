@font-face loader for webpack
=========

**I am aware that this loader might be out of scope for webpack, however I'm still wondering what it might do for the future. This project is currently a work in progress.**

As of today, implementing font-faces is still a cumbersome task to do. Most of us go to an online conversion site to make it happen. With the current state of JavaScript, we must be able to do it quicker and simpler. Welcome FontFeest.

This is all it takes to generate all your required formats. Just hand in a .ttf file and the other files as well as the matching CSS is generated automatically (including `font-weight` and `font-style` properties).

```javascript
createFontFace('./fixtures/OpenSans-Light.ttf').then((css) => {
  console.log(css);
});
```

## Installing

I'll make sure this plugin becomes available when properly tested and integrated. For now clone this repository and require it's index.

## Roadmap

* Try integrating with the Webpack enviroment to make it easy to output CSS at the right place.
* Explore ways to integrate with node require and eventually a Webpack Plugin.
* Add tests
* Add to npmjs.org
