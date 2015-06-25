/*
 * angular-downloadsvg-directive
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */
/* global angular */
/* global document */
/* global window */
/* global require */
/* global saveAs */

(function () {
	'use strict';

	var svgStyles = {   // Whitelist of CSS stylkes and default values
		'alignment-baseline':'auto',
		'baseline-shift':'baseline',
		'clip':'auto',
		'clip-path':'none',
		'clip-rule':'nonzero',
		'color':'rgb(51, 51, 51)',
		'color-interpolation':'srgb',
		'color-interpolation-filters':'linearrgb',
		'color-profile':'auto',
		'color-rendering':'auto',
		'cursor':'auto',
		'direction':'ltr',
		'display':'inline',
		'dominant-baseline':'auto',
		'enable-background':'',
		'fill':'rgb(0, 0, 0)',
		'fill-opacity':'1',
		'fill-rule':'nonzero',
		'filter':'none',
		'flood-color':'rgb(0, 0, 0)',
		'flood-opacity':'1',
		'font':'',
		'font-family':'normal',
		'font-size':'medium',
		'font-size-adjust':'auto',
		'font-stretch':'normal',
		'font-style':'normal',
		'font-variant':'normal',
		'font-weight':"400",
		'glyph-orientation-horizontal':'0deg',
		'glyph-orientation-vertical':'auto',
		'image-rendering':'auto',
		'kerning':'auto',
		'letter-spacing':'0',
		'lighting-color':'rgb(255, 255, 255)',
		'marker':'',
		'marker-end':'none',
		'marker-mid':'none',
		'marker-start':'none',
		'mask':'none',
		'opacity':'1',
		'overflow':'visible',
		'pointer-events':'auto',
		'shape-rendering':'auto',
		'stop-color':'rgb(0, 0, 0)',
		'stop-opacity':'1',
		'stroke':'none',
		'stroke-dasharray':'none',
		'stroke-dashoffset':'0',
		'stroke-linecap':'butt',
		'stroke-linejoin':'miter',
		'stroke-miterlimit':'4',
		'stroke-opacity':'1',
		'stroke-width':'1',
		'text-anchor':'start',
		'text-decoration':'none',
		'text-rendering':'auto',
		'unicode-bidi':'normal',
		'visibility':'visible',
		'word-spacing':'0px',
		'writing-mode':'lr-tb'
	};

	var svgAttrs = [  // white list of attributes
		'id', 'xml:base', 'xml:lang', 'xml:space', // Core
		'height', 'result', 'width', 'x', 'y',     // Primitive
		'xlink:href',                              // Xlink attribute
		'style','class',
		'd','pathLength',                          // Path
		'x','y','dx','dy','glyphRef','format',
		'x1','y1','x2','y2',
		'rotate','textLength',
		'cx','cy','r',
		'rx','ry',
		'fx','fy',
		'width','height',
		'refx','refy','orient',
		'markerUnits','markerWidth','markerHeight',
		'maskUnits',
		'transform',
		'viewBox','version',											// Container
		'preserveAspectRatio','xmlns',
		'points',				// Polygons
		'offset'
	];

	// adapted from https://github.com/angular/angular.js/issues/2866#issuecomment-31012434
	function getStyles(node, name) {
		var val;

		if (angular.isDefined(node.currentStyle)) {  //for old IE
			val = node.currentStyle[name];
		} else if (angular.isDefined(window.getComputedStyle)){  //for modern browsers
			val = node.ownerDocument.defaultView.getComputedStyle(node,null)[name];
		} else {
			val = node.style[name];
		}
		return  (val === '') ? undefined : val;
	}

	function copyStyles(target, source) {
		var styles = {};

		angular.forEach(svgStyles, function(value, name) {
			var src = getStyles(source[0],name);
			var par = getStyles(source.parent()[0], name);
			if (src && src !== value && src !== par) {
				styles[name] = src;
			}
		});

		target.css(styles);
	}

	function getAttrs(elms) {  // gets list of attributes to remove
		var attrs = [];

		elms = angular.element(elms);

		angular.forEach(elms, function(elm) {
			angular.forEach(elm.attributes, function(attr) {
				// remove if it is not style nor on whitelist
				// keeping attributes that are also styles because some styles are not copied
				if(attr.specified && angular.isUndefined(svgStyles[attr.name]) && svgAttrs.indexOf(attr.name) < 0) {
					attrs.push(attr.name);
				}
			});
		});

		return attrs.join(' ');
	}

	function cloneWithStyle(src) {

		var d = src.clone(false);
		var od = src.find('*');

		angular.forEach(d.find('*'), function(elm, index) {
			var source = angular.element(od[index]);
			var target = angular.element(elm);
			copyStyles(target, source);
			target.removeAttr(getAttrs(elm));
		});

		d.removeAttr(getAttrs(d));

		return d;
	}

  angular.module('hc.downloader', [])

  // Losely based on code from https://github.com/densitydesign/raw/blob/master/js/directives.js
  .factory('svgDownload', ['$log', '$window', function($log, $window) {

	var _saveAs = $window.saveAs || (function () {
		if (typeof module !== 'undefined' && typeof exports === 'object') {
			return require('FileSaver') || saveAs;
		}
		return saveAs;
	})();

	function check() {
		var b = true;

		if (angular.isUndefined(_saveAs)) {
			$log.warn('svgDownload Error: FileSaver not loaded.  See installation instructions.');
			b = false;
		}

		if (angular.isUndefined($window.Blob)) {
			$log.warn('svgDownload Error: W3C Blob interface not available.  Try adding https://github.com/eligrey/Blob.js.');
			b = false;
		}

		return b;
	}

	check();

	return function(el) {
		if (!check()) { return; }

		if (angular.isString(el) && el.charAt(0) != '<') {
			el = document.querySelector(el);
		}

		var svg = angular.element(el);

		if (svg.prop('tagName') !== 'svg') {
			svg = svg.find('svg');
		}

		if (svg.length < 1) {
			$log.warn('svgDownload Error: Element ' + el + ' not found');
			return null;
		}

		svg = cloneWithStyle(svg, svgStyles);

		svg
			.attr("version", 1.1)
			.attr("xmlns", "http://www.w3.org/2000/svg");

		var html = svg[0].outerHTML || (new $window.XMLSerializer()).serializeToString(svg[0]);
		var blob = new $window.Blob([html], { type: "text/xml" });

		return {
			getHtml: function() { return html; },
			getBlob: function() { return blob; },
			asSvg: function(filename) { _saveAs(blob, filename); }
		};

	};

  }])

 /**
   * @ngdoc directive
   * @name hc.downloader.directive:svgDownload
   * @restrict A
   * @element button
   *
   * @description
   * AngularJS directive to download an SVG element as an SVG file.
   *
   * @param {string} svg-download The source element to download.  If blank uses the first svg in teh body.
   * @param {string=} filename Name of resaulting svg file.  If blank uses title or 'untitled.svg'
   *
   * @example

	 ## A simple example

	  <example module="hc.downloader">
		<file name="example.html">
		  <div ng-include="'octocat.html'"></div>
		  <button svg-download title="mysvg">Download svg</button>
		  <small class="pull-right">Source: <a href="https://gist.github.com/johan/1007813">https://gist.github.com/johan/1007813</a></small>
		</file>
		<file name="octocat.html">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.2 -1 379 334">
		   <path id="puddle" d="m296.94 295.43c0 20.533-47.56 37.176-106.22 37.176-58.67 0-106.23-16.643-106.23-37.176s47.558-37.18 106.23-37.18c58.66 0 106.22 16.65 106.22 37.18z"/>
		   <g id="shadow-legs">
			<path d="m161.85 331.22v-26.5c0-3.422-.619-6.284-1.653-8.701 6.853 5.322 7.316 18.695 7.316 18.695v17.004c6.166.481 12.534.773 19.053.861l-.172-16.92c-.944-23.13-20.769-25.961-20.769-25.961-7.245-1.645-7.137 1.991-6.409 4.34-7.108-12.122-26.158-10.556-26.158-10.556-6.611 2.357-.475 6.607-.475 6.607 10.387 3.775 11.33 15.105 11.33 15.105v23.622c5.72.98 11.71 1.79 17.94 2.4z"/>
			<path d="m245.4 283.48s-19.053-1.566-26.16 10.559c.728-2.35.839-5.989-6.408-4.343 0 0-19.824 2.832-20.768 25.961l-.174 16.946c6.509-.025 12.876-.254 19.054-.671v-17.219s.465-13.373 7.316-18.695c-1.034 2.417-1.653 5.278-1.653 8.701v26.775c6.214-.544 12.211-1.279 17.937-2.188v-24.113s.944-11.33 11.33-15.105c0-.01 6.13-4.26-.48-6.62z"/>
		   </g>
		   <path id="cat" d="m378.18 141.32l.28-1.389c-31.162-6.231-63.141-6.294-82.487-5.49 3.178-11.451 4.134-24.627 4.134-39.32 0-21.073-7.917-37.931-20.77-50.759 2.246-7.25 5.246-23.351-2.996-43.963 0 0-14.541-4.617-47.431 17.396-12.884-3.22-26.596-4.81-40.328-4.81-15.109 0-30.376 1.924-44.615 5.83-33.94-23.154-48.923-18.411-48.923-18.411-9.78 24.457-3.733 42.566-1.896 47.063-11.495 12.406-18.513 28.243-18.513 47.659 0 14.658 1.669 27.808 5.745 39.237-19.511-.71-50.323-.437-80.373 5.572l.276 1.389c30.231-6.046 61.237-6.256 80.629-5.522.898 2.366 1.899 4.661 3.021 6.879-19.177.618-51.922 3.062-83.303 11.915l.387 1.36c31.629-8.918 64.658-11.301 83.649-11.882 11.458 21.358 34.048 35.152 74.236 39.484-5.704 3.833-11.523 10.349-13.881 21.374-7.773 3.718-32.379 12.793-47.142-12.599 0 0-8.264-15.109-24.082-16.292 0 0-15.344-.235-1.059 9.562 0 0 10.267 4.838 17.351 23.019 0 0 9.241 31.01 53.835 21.061v32.032s-.943 11.33-11.33 15.105c0 0-6.137 4.249.475 6.606 0 0 28.792 2.361 28.792-21.238v-34.929s-1.142-13.852 5.663-18.667v57.371s-.47 13.688-7.551 18.881c0 0-4.723 8.494 5.663 6.137 0 0 19.824-2.832 20.769-25.961l.449-58.06h4.765l.453 58.06c.943 23.129 20.768 25.961 20.768 25.961 10.383 2.357 5.663-6.137 5.663-6.137-7.08-5.193-7.551-18.881-7.551-18.881v-56.876c6.801 5.296 5.663 18.171 5.663 18.171v34.929c0 23.6 28.793 21.238 28.793 21.238 6.606-2.357.474-6.606.474-6.606-10.386-3.775-11.33-15.105-11.33-15.105v-45.786c0-17.854-7.518-27.309-14.87-32.3 42.859-4.25 63.426-18.089 72.903-39.591 18.773.516 52.557 2.803 84.873 11.919l.384-1.36c-32.131-9.063-65.692-11.408-84.655-11.96.898-2.172 1.682-4.431 2.378-6.755 19.25-.80 51.38-.79 82.66 5.46z"/>
		   <path id="face" d="m258.19 94.132c9.231 8.363 14.631 18.462 14.631 29.343 0 50.804-37.872 52.181-84.585 52.181-46.721 0-84.589-7.035-84.589-52.181 0-10.809 5.324-20.845 14.441-29.174 15.208-13.881 40.946-6.531 70.147-6.531 29.07-.004 54.72-7.429 69.95 6.357z"/>
		   <path id="eyes" d="m160.1 126.06 c0 13.994-7.88 25.336-17.6 25.336-9.72 0-17.6-11.342-17.6-25.336 0-13.992 7.88-25.33 17.6-25.33 9.72.01 17.6 11.34 17.6 25.33z m94.43 0 c0 13.994-7.88 25.336-17.6 25.336-9.72 0-17.6-11.342-17.6-25.336 0-13.992 7.88-25.33 17.6-25.33 9.72.01 17.6 11.34 17.6 25.33z"/>
		   <g id="face-features">
			 <path id="pupils" d="m154.46 126.38 c0 9.328-5.26 16.887-11.734 16.887s-11.733-7.559-11.733-16.887c0-9.331 5.255-16.894 11.733-16.894 6.47 0 11.73 7.56 11.73 16.89z m94.42 0 c0 9.328-5.26 16.887-11.734 16.887s-11.733-7.559-11.733-16.887c0-9.331 5.255-16.894 11.733-16.894 6.47 0 11.73 7.56 11.73 16.89z"/>
			 <circle id="nose" cx="188.5" cy="148.56" r="4.401"/>
			 <path id="mouth" d="m178.23 159.69c-.26-.738.128-1.545.861-1.805.737-.26 1.546.128 1.805.861 1.134 3.198 4.167 5.346 7.551 5.346s6.417-2.147 7.551-5.346c.26-.738 1.067-1.121 1.805-.861s1.121 1.067.862 1.805c-1.529 4.324-5.639 7.229-10.218 7.229s-8.68-2.89-10.21-7.22z"/>
		   </g>
		   <path id="octo" d="m80.641 179.82 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m8.5 4.72 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m5.193 6.14 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m4.72 7.08 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m5.188 6.61 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m7.09 5.66 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m9.91 3.78 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m9.87 0 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z m10.01 -1.64 c0 1.174-1.376 2.122-3.07 2.122-1.693 0-3.07-.948-3.07-2.122 0-1.175 1.377-2.127 3.07-2.127 1.694 0 3.07.95 3.07 2.13z"/>
		   <path id="drop" d="m69.369 186.12l-3.066 10.683s-.8 3.861 2.84 4.546c3.8-.074 3.486-3.627 3.223-4.781z"/>
		  </svg>
		</file>
		<file name="octocat.css">
		  #puddle { fill: #9CDAF1; }
		  #shadow-legs { fill: #7DBBE6; }
		  #face { fill: #F4CBB2; }
		  #eyes { fill: #FFF; }
		  #face-features { fill: #AD5C51; }
		  #octo { fill: #C3E4D8; }
		  #drop { fill: #9CDAF1; }}
		</file>
	  </example>

   */
  .directive('svgDownload', ['svgDownload', function (svgDownload) {
	return {
	  restrict: 'A',
	  link: function (scope, element, attrs) {

		element.on('click', function() {
		  //scope.$apply(function() {
			download();
		  //});
		});

		function download(){
		  var filename = encodeURI(attrs.filename || attrs.title || 'untitled') + ".svg";
		  var svg = svgDownload(attrs.svgDownload || 'body');
		  if(svg) { svg.asSvg(filename); }
		}

	  }
	};
  }]);

})();
