# angular-downloadsvg-directive
AngularJS directive to download an svg element as an SVG file.

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
MIT