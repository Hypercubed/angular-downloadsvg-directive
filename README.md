angular-downloadsvg-directive [![Bower version](https://badge.fury.io/bo/angular-downloadsvg-directive.svg)](http://badge.fury.io/bo/angular-marked)
===

AngularJS directive to download an svg element as an SVG file, including CSS defined based styles.

[![get this with bower](http://benschwarz.github.io/bower-badges/badge@2x.png)](http://bower.io/ "get this with bower")

## Features
- Downloads the first `<svg>` element by default.
- Download `<svg>` by id.
- Copies svg element styles as rendered in the browser, including styles defined in CSS stylesheets.
- Copies only svg relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).

## Usage
1. `bower install Hypercubed/angular-downloadsvg-directive`
2. Include the `FileSaver.js` in your app.  By default at `bower_components/FileSaver/FileSaver.js`.
3. Include the `angular-downloadsvg-directive.js` in app.  By default at `bower_components/angular-downloadsvg-directive/angular-downloadsvg-directive.js`.
4. Add `hc.downloader` as a module dependency to your app.

### As a directive

```html
	<button svg-download="#chart" title="mysvg">Download svg</button>
```

By default the downloaded file filename will be the title attribute plus ".svg".  An optional filename attribute can also be given. [See documentation](https://hypercubed.github.io/angular-downloadsvg-directive/#/api/hc.downloader.directive:svgDownload)

## Acknowledgments
Some portions of this directive inspired by code from [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) and [moagrius/copycss](https://github.com/moagrius/copycss).

## License
Copyright (c) 2013 Jayson Harshbarger

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
