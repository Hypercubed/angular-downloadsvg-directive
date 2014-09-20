angular-downloadsvg-directive [![Bower version](https://badge.fury.io/bo/angular-downloadsvg-directive.svg)](http://badge.fury.io/bo/angular-marked)
===

AngularJS directive to download an svg element as an SVG file.

[![get this with bower](http://benschwarz.github.io/bower-badges/badge@2x.png)](http://bower.io/ "get this with bower")

## Usage
1. `bower install Hypercubed/angular-downloadsvg-directive`
2. Include the `FileSaver.js` script into your app.  By default should be at `bower_components/FileSaver/FileSaver.js`.
3. Include the `angular-downloadsvg-directive.js` into your app.  By default should be at `bower_components/angular-downloadsvg-directive/angular-downloadsvg-directive.js`.
4. Add `hc.downloader` as a module dependency to your app.

### As a directive

```html
	<button svg-download="#chart" title="mysvg">Download svg</button>
```

By default the downloaded file filename will be the title attribute plus ".svg".  An optional filename attribute can also be given.

## Acknowledgments
Based on code snippit from [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) by [densitydesign](https://github.com/densitydesign/).

## License
Copyright (c) 2013 Jayson Harshbarger

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
