angular-downloadsvg-directive [![Bower version](https://badge.fury.io/bo/angular-downloadsvg-directive.png)](http://badge.fury.io/bo/angular-downloadsvg-directive)
===

AngularJS directive to download an SVG element as an SVG or PNG file, including CSS defined styles.

[![get this with bower](http://benschwarz.github.io/bower-badges/badge@2x.png)](http://bower.io/ "get this with bower")

## Features
- Downloads SVG elements as an SVG or PNG file.
- Downloads the first `<svg>` element by default.
- Download `<svg>` by element or selector.
- Copies SVG element styles as rendered in the browser, including styles defined in Cascading Style Sheets (CSS).
- Copies only SVG relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).

## Usage
1. `bower install Hypercubed/angular-downloadsvg-directive`
2. Include the `angular-downloadsvg-directive.js` in app.  By default at `bower_components/angular-downloadsvg-directive/angular-downloadsvg-directive.js`.
4. Add `hc.downloader` as a module dependency to your app.

*For maximum compatibility across browsers include [eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js) and [eligrey/canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js). See [Compatibility-Chart](https://github.com/Hypercubed/svgsaver/wiki/Compatibility-Chart) for more information.*

### As a directive

```html
	<button svg-download="#chart" title="mysvg">Download as SVG</button>
	<button svg-download="#chart" title="mysvg" type="png">Download as PNG</button>
```

By default the downloaded file filename will be the title attribute plus ".svg" (or "png").  An optional filename attribute can also be given. [See documentation](https://hypercubed.github.io/angular-downloadsvg-directive/#/api/hc.downloader.directive:svgDownload)

## License
Copyright (c) 2013-2015 Jayson Harshbarger

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
