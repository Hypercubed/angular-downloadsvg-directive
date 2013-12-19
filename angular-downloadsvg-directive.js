(function () {

  angular.module('hc.downloader', []);

  // Original code from https://github.com/densitydesign/raw/blob/master/js/directives.js
  angular.module('hc.downloader').directive('svgDownloader', function () {
    return {
      restrict: 'AE',
      replace:true,
      scope : {
        type : '@',
        source : '@',
        label : '@',
        title : '='
      },
      template :  '<button class="btn btn-block btn-success push-up" ng-click="download()">{{label}}</button>',
      link: function postLink(scope, element, attrs) {

        scope.download = function(){
          if(!scope.source || !scope.type) return;
          if (scope.type == "svg") downloadSVG();
        }

        /* Download SVG */
        function downloadSVG(){

          var elm = angular.element(scope.source);

          elm.find('svg')
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg");

          var html = elm.html();

          var blob = new Blob([html], { type: "data:image/svg+xml" });
          saveAs(blob, (encodeURI(scope.title) || 'untitled') + ".svg")

        }
      }
    };
  });

})();
