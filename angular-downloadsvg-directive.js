(function () {

  var app = angular.module('hc.downloader', []);

  // Losely based on code from https://github.com/densitydesign/raw/blob/master/js/directives.js
  app.factory('svgDownload', function() {

    return function(el) {

      var elm = angular.element(el);

      elm.find('svg')
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg");

      var html = elm.html();

      var blob = new Blob([html], { type: "data:image/svg+xml" });

      return {
        getHtml: function() { return html; },
        getBlob: function() { return blob; },
        asSvg: function(filename) { saveAs(blob, filename); }
      };

    };

  });

  app.directive('svgDownload', ['svgDownload', function (svgDownload) {
    return {
      restrict: 'A',
      scope : {
        source : '@svgDownload'
      },
      link: function (scope, element, attrs) {

        element.on('click', function(event) {
          scope.$apply(function() {
            download();
          });
        });

        function download(){
          var filename = encodeURI(attrs.filename || attrs.title || 'untitled') + ".svg";
          if(!scope.source) return;
          svgDownload(scope.source).asSvg(filename);
        }

      }
    };
  }]);

})();
