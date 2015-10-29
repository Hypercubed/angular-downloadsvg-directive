module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    },

    ngdocs: {
      options: {
        html5Mode: false,
        titleLink: "#/api/hc.downloader.directive:svgDownload",
        startPage: '/api/hc.downloader.directive:svgDownload',
        navTemplate: './docs-template/nav.html',
        scripts: [
          './bower_components/FileSaver/FileSaver.js',
          './bower_components/canvas-toBlob.js/canvas-toBlob.js',
          './bower_components/angular/angular.js',
          './bower_components/angular-animate/angular-animate.js',
          './<%= pkg.name %>.js',
          './docs-template/script.js',
        ],
        discussions: {
          shortName: 'hypercubedgithub',
          url: 'http://hypercubed.github.io/<%= pkg.name %>/#',
          dev: false
        }
      },
      all: ['lib/<%= pkg.name %>.js']
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'docs',
          hostname: 'localhost',
          open: true
        }
      }
    },

    watch: {
      parser: {
        files: ['<%= pkg.name %>.js','./docs-template/*.*'],
        tasks: ['ngdocs']
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('serve', ['ngdocs','connect','watch']);
  grunt.registerTask('publish', ['ngdocs','gh-pages']);

};
