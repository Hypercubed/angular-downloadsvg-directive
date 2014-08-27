(function () {

  var app = angular.module('hc.downloader', []);

  // Losely based on code from https://github.com/densitydesign/raw/blob/master/js/directives.js
  app.factory('svgDownload', ['$log', function($log) {

    return function(el) {

      var svg = angular.element(el);

      if (svg.prop('tagName') !== 'svg') {
        svg = svg.find('svg');
      }

      if (svg.length < 1) {
        $log.warn('svgDownload Error: Element ' + el + ' not found');
        return null;
      }

      svg
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg");

      var html = svg[0].outerHTML || new XMLSerializer().serializeToString(svg[0]);
      var blob = new Blob([html], { type: "data:image/svg+xml" });

      return {
        getHtml: function() { return html; },
        getBlob: function() { return blob; },
        asSvg: function(filename) { saveAs(blob, filename); }
      };

    };

  }]);

  app.directive('svgDownload', ['svgDownload', function (svgDownload) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        element.on('click', function(event) {
          scope.$apply(function() {
            download();
          });
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
