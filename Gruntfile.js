// Generated on 2014-06-23 using generator-angular 0.9.1
'use strict';

// # Globbing
// We're using this to recursively match all sub-folders:
//   'test/spec/**/*.js'
//
// If you only need to match one level down, you may use this for performance reasons instead:
//   'test/spec/{,*/}*.js'
//
// The {,*/} token substring gives an option of matching no subdirectory (left of the ,) or

module.exports = function (grunt) {
  // For building filesystem paths by concatenation.
  var path = require('path');

  // For functional style utilities.
  var _ = require('lodash');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var bowerJson = grunt.file.readJSON('./bower.json') || {};
  var bowerRc = grunt.file.readJSON('./.bowerrc') || {};
  var appConfig = {
    app: bowerJson.appPath ? bowerJson.appPath : 'client/ngapp',
    vendor: bowerRc.directory ? bowerRc.directory : 'bower_components',
    dev: 'build/dev',
    dist: 'build/dist',
    temp: 'build/temp'
  };

  // All children wildcard globs recur often, so only compute them once and reuse.
  var allChildrenGlob = path.join('.', '**', '*');
  var relSubdirsGlob = path.join('.', '**');

  function allExtGlob(extension) {
    return path.join('**', '.' + extension);
  }

  // Define the configuration for all the tasks
  grunt.initConfig(
    {
      // Project settings
      appConfig: appConfig,

      // Project settings
      pkg: grunt.file.readJSON(
        path.join('.', 'package.json')),

      yeoman: {
        app: '<%= appConfig.app %>',
        dist: '<%= appConfig.dist %>'
      },

      // Watches files for changes and runs tasks based on the changed files     // Watches files for changes and runs tasks based on the changed files
      watch: {
        options: {
          livereload: '<%= connect.develop.options.livereload %>'
        },

        nodemon: {
          // TODO: Drop this unless we do actually use a real Express server for the developer mock.
          // TODO: If this is used, add a disambiguator like PORT to the file in case multiple servers
          //       are live.
          // If nodemon recycles the server, it touches this marker, which in turn causes livereload to
          // signal need for refresh to browsers.
          files: ['.rebooted'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },
        buildSpec: {
          // TODO: The intent is to start the build over from the beginning.  Can watch cycle itself down to free the port?  If not, we'll spawn a new
          //       child build without completing the present one and the next pass through the final steps will find the server port already in use.
          files: ['bower.json', 'package.json', 'Gruntfile.js', path.join('client', 'build.js')],
          tasks: ['serve:dev'],
          options: {
            reload: true,
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },

        js: {
          files: '<%= appConfig.app %>/scripts/**/*.js',
          // tasks: ['newer:jshint:build', 'browserifyBower:build:nowrite', 'makeBundle:dev'],
          tasks: ['newer:jshint:build', 'makeBundle:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },
        coffee: {
          files: '<%= appConfig.app %>/scripts/**/*.coffee',
          // tasks: ['newer:coffeelint:build', 'browserifyBower:build:nowrite', 'makeBundle:dev'],
          tasks: ['newer:coffeelint:build', 'makeBundle:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },

        // coffeeTest: {
        //   files: ['<%= appConfig.app %>/test/spec/**/*.coffee'],
        //   tasks: ['newer:coffeelint:test', 'newer:coffee:test', 'karma']
        // },
        // jsTest: {
        //   files: ['<%= appConfig.app %>/test/spec/**/*.js'],
        //   tasks: ['newer:jshint:test', 'newer:copy:test', 'karma']
        // },

        sass: {
          files: '<%= appConfig.app %>/styles/**/*.sass',
          tasks: ['newer:sass:build', 'newer:autoprefixer:build', 'htmlbuild:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },
        css: {
          files: '<%= appConfig.app %>/styles/**/*.css',
          tasks: ['newer:autoprefixer:build', 'htmlbuild:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },

        jade: {
          files: [path.join('<%=appConfig.app %>', 'views', allExtGlob('jade'))],
          tasks: ['newer:jade', 'newer:copy:dev']
        },

        /*
        indexJade: {
          // TODO: Deprecated--not supported anymore.  Prune this block soon!!
          files: ['<%= appConfig.app %>/index.jade'],
          tasks: ['newer:copy:build', 'newer:jade:dev', 'htmlbuild:dev', 'wiredep:dev', 'makeBundle:dev']
        },
        */
        indexHtml: {
          files: ['<%= appConfig.app %>/index.html'],
          // tasks: ['newer:copy:build', 'htmlbuild:dev', 'wiredep:dev', 'browserifyBower:build:nowrite', 'makeBundle:dev'],
          tasks: ['newer:copy:build', 'htmlbuild:dev', 'wiredep:dev', 'makeBundle:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        },

        copied: {
          files: [
            // TODO: Confirm whether or not connect will pick up static file changes without a process restart.
            //       It should, otherwise live reload would be a rather pointless feature...  :)
            path.join('<%= appConfig.app %>', 'images', allExtGlob('{jpg,jpeg,gif,png,svg,webp}')),
            path.join('<%= appConfig.app %>', 'styles', 'fonts', allChildrenGlob),
            path.join('<%= appConfig.app %>', 'fonts', allChildrenGlob),
            path.join('<%= appConfig.app %>', 'views', allExtGlob('html')),
            path.join('<%= appConfig.app %>', '.', '*.{ico,png,txt}'),
            path.join('<%= appConfig.app %>', '.', '.htaccess')
          ],
          tasks: ['newer:copy:dev'],
          options: {
            livereload: '<%= connect.develop.options.livereload %>'
          }
        }
      },


      // The actual grunt server settings
      connect: {
        //mock: {
        //  options: {
        //    keepalive: true,
        //    middleware: [
        //      mockApi({
        //        swaggerFile: path.join(__dirname, 'swagger.yaml'),
        //        watch: true
        //      })
        //    ]
        //  }
        //},
        develop: {
          options: {
            open: true,
            port: 8080,
            host: '0.0.0.0',
            keepalive: false,
            livereload: 35729,
            hostname: '0.0.0.0',
            base: ['<%= appConfig.dev %>']
          }
        },
        serve: {
          options: {
            open: true,
            port: 8888,
            host: '0.0.0.0',
            keepalive: true,
            livereload: 35829,
            hostname: '0.0.0.0',
            base: '<%= appConfig.dist %>'
          }
        }
      },

      // Empties folders to start fresh
      clean: {
        all: {
          files: [{
            dot: true,
            src: [
              '<%= appConfig.temp %>/**/*',
              '!<%= appConfig.dev %>/.git*',
              '!<%= appConfig.dist %>/.git*'
            ]
          }]
        },
        build: {
          files: {
            dot: true,
            src: ['<%= appConfig.temp %>']
          }
        },
        dev: {
          files: {
            dot: true,
            src: ['<%= appConfig.dev %>/**/*', '!<%= appConfig.dev %>/.git*']
          }
        },
        dist: {
          files: {
            dot: true,
            src: ['<%= appConfig.dist %>/**/*', '!<%= appConfig.dist %>/.git*']
          }
        }
      },

      // Make sure code styles are up to par and there are no obvious mistakes
      jshint: {
        options: {
          reporter: require('jshint-stylish')
        },
        build: {
          options: {
            jshintrc: '.jshintrc'
          },
          src: [
            'Gruntfile.js',
            '<%= appConfig.app %>/scripts/**/*.js',
            '!<%= appConfig.app %>/scripts/fh-mgr/apiv1/*.js'
          ]
        },
        test: {
          options: {
            jshintrc: '<%= appConfig.app %>/test/.jshintrc'
          },
          src: ['<%= appConfig.app %>/test/spec/**/*.js']
        }
      },


      coffeelint: {
        options: {
          configFile: 'coffeelint.json'
        },
        build: {
          src: '<%= appConfig.app %>/scripts/**/*.coffee'
        },
        test: {
          src: '<%= appConfig.app %>/test/spec/**/*.coffee'
        }
      },


      // NOTE: At one point this build process had to support application LESS documents that @imported one or more
      //       LESS documents provided by Twitter bootstrap.  The search path below supported a mix of 3rd party
      //       provided style sheets and application-defined ones.
      sass: {
        options: {
          sourcemap: 'file',
          trace: true,
          unixNewlines: true,
          style: 'expanded',
          precision: -1,
          quiet: false,
          compass: false,
          debugInfo: true,
          lineNumbers: true,
          loadPath: [
            '<%= appConfig.app %>/styles',
            '<%= appConfig.vendor %>/bootstrap-sass-official/assets/stylesheets',
            '<%= appConfig.vendor %>/fontawesome/scss'
          ],
          require: [],
          cacheLocation: '.sass-cache',
          noCache: true,
          bundleExec: false,
          update: false
        },
        build: {
          ext: '.css',
          expand: true,
          extDot: 'last',
          cwd: '<%= appConfig.app %>/styles',
          src: [path.join(relSubdirsGlob, '*.sass')],
          dest: '<%= appConfig.temp %>/sass'
        }
      },


      // Add vendor prefixed styles
      autoprefixer: {
        options: {
          browsers: ['last 2 version']
        },
        build: {
          files: [
            {
              expand: true,
              cwd: '<%= appConfig.temp %>/sass',
              src: path.join(relSubdirsGlob, '*.css'),
              dest: '<%= appConfig.temp %>/styles'
            }, {
              expand: true,
              cwd: '<%= appConfig.app %>/styles',
              src: path.join(relSubdirsGlob, '*.css'),
              dest: '<%= appConfig.temp %>/styles'
            }
          ]
        }
      },


      modernizr: {
        dev: {
          // [REQUIRED] Path to the build you're using for development.
          // "devFile" : "lib/modernizr-dev.js",
          // devFile : 'remote',
          devFile: path.join('<%= appConfig.vendor %>', 'modernizr', 'modernizr.js'),

          // Path to save out the built file.
          outputFile : path.join('<%= appConfig.dev %>', 'scripts', 'modernizr-custom.js'),

          // Defaults match default settings on http://modernizr.com/download/
          // Overrides reflect all-features development build of Modernizr.
          extra : {
            printshiv : true,
            mq : true
          },
          extensibility : {
            addtest : true,
            prefixed : true,
            teststyles : true,
            testprops : true,
            testallprops : true,
            hasevents : true,
            prefixes : true,
            domprefixes : true
          },

          // By default, source is uglified before saving
          uglify : false,

          // By default, this task will crawl your project for references to Modernizr tests.
          // Set to false to disable.
          parseFiles : true,

          // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
          // except files that are in node_modules/.
          // You can override this by defining a files array below.
          files : {
            src: [path.join('<%= appConfig.dev %>', allExtGlob('{js,css,scss,sass}'))]
          },

          // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
          // handler: function (tests) { console.log('Modernizr tests: ', tests); },
          handler: _.partial(console.log, 'Modernizr tests:'),
        },
        dist: {
          // [REQUIRED] Path to the build you're using for development.
          // devFile : lib/modernizr-dev.js,
          devFile: path.join('<%= appConfig.vendor %>', 'modernizr', 'modernizr.js'),

          // Path to save out the built file.
          outputFile : path.join('<%= appConfig.dist %>', 'scripts', 'modernizr-custom.js'),

          // Defaults match default settings on http://modernizr.com/download/
          // Overrides reflect all-features development build of Modernizr.
          extra : {
            printshiv : true,
            mq : true
          },
          extensibility : {
            addtest : true,
            prefixed : true,
            teststyles : true,
            testprops : true,
            testallprops : true,
            hasevents : true,
            prefixes : true,
            domprefixes : true
          },

          // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
          // except files that are in node_modules/.
          // You can override this by defining a files array below.
          files : {
            src: [ path.join('<%= appConfig.dist %>', allExtGlob('{js,css,scss,sass}')) ]
          },

          // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
          // handler: function (tests) { console.log('Modernizr tests: ', tests); },
          handler: _.partial(console.log, 'Modernizr tests:')
        }
      },

      // Compiles CoffeeScript to JavaScript.
      coffee: {
        options: {
          sourceMap: true
        },
        test: {
          ext: '.js',
          expand: true,
          extDot: 'last',
          cwd: path.join('<%= appConfig.app %>', 'test', 'spec'),
          src: [ path.join(relSubdirsGlob, '*.coffee') ],
          dest: path.join('<%= appConfig.temp %>', 'test', 'spec')
        }
      },


      'swagger-js-codegen': {
        options: {
          apis: [
            {
              swagger: 'swagger/mgmt-swagger.json',
              moduleName: 'fh-mgr.apiv1',
              className: 'Catalog',
              fileName: './fh-mgr/apiv1/CatalogClient.service.js',
              angularjs: true
            }
          ],
          dest: 'client/ngapp/scripts',
        }
      },


      jade: {
        options: {
          ext: '.html',
          expand: true,
          extDot: 'last',
          cwd: path.join('<%= appConfig.app %>', 'views'),
          src: [ path.join( '.', allExtGlob('jade')) ],
          dest: path.join('<%= appConfig.temp %>', 'views'),
        },
        /*
        TODO: Prune these blocks!
        dev: {
          options: {
            dest: '<%= appConfig.dev %>',
            data: function() {
              return {
                CATALOG_API_HOST: '0.0.0.0',
                CATALOG_API_PORT: 8081,
                NODE_ENV: 'development',
                UI_HOST: '0.0.0.0',
                UI_PORT: 8080
              };
            }
          }
        },
        dist: {
          options: {
            dest: '<%= appConfig.dist %>',
            data: function() {
              return {
                CATALOG_API_HOST: '0.0.0.0',
                CATALOG_API_PORT: 8081,
                NODE_ENV: 'staging',
                UI_HOST: '0.0.0.0',
                UI_PORT: 8888
              };
            }
          }
        }
        */
      },


      // To control the order of css file concatenation, it will be necessary to replace the
      // glob expression bound below to options.styles.bundle with an explicitly ordered list.
      // Consider doing this in the pre-initConfig section and then linking it here from there.
      htmlbuild: {
        options: {
          prefix: '<%= appConfig.temp %>',
          parseTag: 'htmlbuild',
          relative: true,
          styles: {
            bundle: {
              files: [
                path.join('styles', allExtGlob('css')),
                path.join('styles', allExtGlob('css'))
              ]
            }
          },
          data: {
            PRODUCT_VERSION: '0.1.0',
            PRODUCT_TITLE: 'test'
          }
        },
        dev: {
          src: [ path.join( '<%= appConfig.temp %>', 'index.html') ],
          dest: '<%= appConfig.dev %>',
          options: {
            beautify: true,
            data: {
              // Data to pass to templates
              CATALOG_API_VERSION: 'v1',
              CATALOG_API_HOST: '0.0.0.0',
              CATALOG_API_PORT: 8081,
              NODE_ENV: 'development',
              UI_HOST: '0.0.0.0',
              UI_PORT: 8080
            }
          }
        },
        dist: {
          src: [path.join( '<%= appConfig.temp %>', 'index.html')],
          dest: '<%= appConfig.dist %>',
          options: {
            beautify: false,
            data: {
              // Data to pass to templates
              CATALOG_API_VERSION: 'v1',
              CATALOG_API_HOST: '0.0.0.0',
              CATALOG_API_PORT: 8081,
              NODE_ENV: 'staging',
              UI_HOST: '0.0.0.0',
              UI_PORT: 8888
            }
          }
        }
      },


      ngAnnotate: {
        options: {
          singleQuotes: true,
          remote: true,
          add: true
        },
        build: {
          files: {
            expand: true,
            cwd: path.join('<%= appConfig.app %>','scripts', 'fh-mgr'),
            src: [allExtGlob('js')],
            dest: path.join('<%= appConfig.temp %>','scripts', 'fh-mgr'),
          }
        }
      },


      // Get the ngAnnotate output from appConfig.temp, but since ngAnnotate does not
      // support CoffeeScript, get those files from appConfig.app and be sure you don't
      // forget to annotate them for minification manually!
      browserify: {
        dev: {
          options: {
            browserifyOptions: {
              debug: true
            },
          },
          files: {
            '<%= appConfig.dev %>/scripts/app.js': [
              '<%= appConfig.app %>/scripts/fh-mgr/**/*.{js,coffee}'
            ]
          }
        },
        dist: {
          options: {
            browserifyOptions: {
              debug: false
            }
          },
          // Writes to temp, not dist.  Usemin will read from temp and write to dist when it
          // is called upon to minify the result.
          files: {
            '<%= appConfig.dev %>/scripts/app.js': [
              '<%= appConfig.app %>/scripts/fh-mgr/**/*.{js,coffee}'
            ]
          }
        },
        options: {
          // extensions: ['.coffee'],
          // transform: ['coffeeify'],
          preBunsadleCB: function (b) {
            console.log('Bundle Configuration Function!');
            b._extensions.push('.coffee');

            // Bower wires coffeeify for us.  If we do it again here, code gets compiled twice
            // and it fails the second time because the input file is JavaScript by then, not
            // CoffeeScript.  Transformations are applied by streaming.
            // b.transform('coffeeify');

            var ngAppRoot = appConfig.app + '/scripts/fh-mgr';
            console.log(ngAppRoot);

            /*
             b.require( path.join(ngAppRoot, 'module') );
             b.require( path.join(ngAppRoot, 'config.js') );
             b.require( path.join(ngAppRoot, 'run.js') );
             */

            /*
             b.require([
             {
             // file: path.join(ngAppRoot, 'module.js'),
             file: 'module.js',
             basedir: ngAppRoot,
             expose: 'fh-mgr/module'
             },
             {
             file: path.join(ngAppRoot, 'config.js'),
             expose: 'fh-mgr/config'
             },
             {
             file: path.join(ngAppRoot, 'run.js'),
             expose: 'fh-mgr/run'
             }
             ]);
             */

            /*b.require(
             [path.join(ngAppRoot, 'module.js'), {expose: 'fh-mgr/module'}],
             [path.join(ngAppRoot, 'config.js'), {expose: 'fh-mgr/config'}],
             [path.join(ngAppRoot, 'run.js'), {expose: 'fh-mgr/run'}]
             );*/

            // Browserify plugin for algorithmic module naming.
            var remapify = require('remapify');

            /*b.require({
             'fh-mgr/module': path.join(ngAppRoot, 'fh-mgr.js'),
             'fh-mgr/config': path.join(ngAppRoot, 'fh-mgr.config.js'),
             'fh-mgr/run': path.join(ngAppRoot, 'fh-mgr.run.js'),
             });*/

            console.log('Returned from require()');

            b.plugin(
              remapify
              [
                {
                  cwd: 'client/ngapp/scripts/fh-mgr',
                  // filter: require('./client/build').ngClientRemapFilter,
                  src: './**/*',
                  expose: 'fh-mgr'
                }
              ]
            );

            console.log('Returned from remapify()');
          },
          plugin: [
            [
              'remapify',
              [
                {
                  filter: require('./build').ngClientRemapFilter,
                  cwd: 'client/ngapp/scripts/fh-mgr',
                  expose: 'fh-mgr',
                  src: './**/*'
                }
              ]
            ]
          ],
          require: [
            'fh-mgr/module',
            'fh-mgr/config',
            'fh-mgr/run'
          ]
          /*
          require: [
            {
              file: '<%= appConfig.app %>/scripts/fh-mgr/module.js',
              expose: 'fh-mgr/module'
            }, {
              file: '<%= appConfig.app %>/scripts/fh-mgr/config.js',
              expose: 'fh-mgr/config'
            }, {
              file: '<%= appConfig.app %>/scripts/fh-mgr/run.js',
              expose: 'fh-mgr/run'
            }
          ]
          */
        }
      },

      /*
       * A promising plug-in, but its about a year old and gets tripped up too easily by unexpected
       * omissions by some dependencies' bower.json files.  Look out for a maintenance release and
       * consider giving it another try then.
       *
      browserifyBower: {
        dist: {
          options: {
            file: '<%= appConfig.dev %>/libs.js'
          }
        },
        dev: {
          options: {
            file: '<%= appConfig.dist %>/libs.js'
          }
        }
      },
       */


      // Automatically inject Bower components into the app
      wiredep: {
        options: {
          bowerJson: bowerJson,
          cwd: '<%= appConfig.app %>',
          directory: '<%= appConfig.vendor %>',   //require('./.bowerrc').directory
          exclude: [ 'bower_components/modernizr/modernizr.js' ],
          ignorePath: /^\.\.\/\.\.\/client\/ngapp\//
        },
        dev: {
          src: [path.join('<%= appConfig.dev %>', 'index.html')]
        },
        dist: {
          src: [path.join('<%= appConfig.dist %>', 'index.html')]
        }
      },
      wiredepCopy: {
        target: {
          options: {
            src: '<%= appConfig.vendor %>',
            dest: '<%= appConfig.temp %>/wiredep',
            wiredep: '<%= wiredep.options %>'
          }
        }
      },


      // Renames files for browser caching purposes
      filerev: {
        options: {
          encoding: 'utf8',
          algorithm: 'md5',
          length: 20
        },
        dist: {
          src: [
            '<%= appConfig.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= appConfig.dist %>/scripts/**/*.js',
            '<%= appConfig.dist %>/styles/**/*.css',
            '<%= appConfig.dist %>/fonts/**/*',
            '<%= appConfig.dist %>/**/*.html'
          ]
        }
      },


      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files.  Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
        html: path.join('<%= appConfig.dist %>', 'index.html'),
        options: {
          root: '<%= appConfig.temp %>',
          dest: '<%= appConfig.dist %>',
          staging: '<%= appConfig.temp %>',
          flow: {
            html: {
              steps: {
                js: ['concat', 'uglifyjs'],
                css: ['concat', 'cssmin']
              },
              post: {}
            }
          }
        }
      },

      usemin: {
        options: {
          assetsDirs: [
            '<%= appConfig.dist %>',
            '<%= appConfig.dist %>/views',
            '<%= appConfig.dist %>/fonts',
            '<%= appConfig.dist %>/images',
            '<%= appConfig.dist %>/scripts',
            '<%= appConfig.dist %>/styles',
            '<%= appConfig.dist %>/styles/fonts'
          ]
        },
        html: [path.join('<%= appConfig.dist %>', allExtGlob('html'))],
        css: [path.join('<%= appConfig.dist %>', 'styles', allExtGlob('css'))]
      },
      cssmin: {
        options: {
          advanced: true,
          mediaMerging: true,
          processImport: true,
          restructuring: true,
          roundingPrecision: -1,
          semanticMerging: true,
          aggressiveMerging: true,
          shorthandCompacting: false,
          // root: path.join('<%= appConfig.temp %>', 'styles'),
          sourceMap: path.join('<%= appConfig.dist %>', 'styles', 'app.css.map')
        /*},
        target: {
          files: {
            '<%= appConfig.temp %>/dist/app.css':
              [path.join('<%= appConfig.temp %>', 'styles', '*.css']
          }*/
        }
      },


      imagemin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= appConfig.app %>/images',
              src: path.join(relSubdirsGlob, '*.{png,jpg,jpeg,gif}'),
              dest: '<%= appConfig.dist %>/images'
            }, {
              expand: true,
              cwd: '<%= appConfig.temp %>/images/generated',
              src: path.join(relSubdirsGlob, '*.{png,jpg,jpeg,gif}'),
              dest: '<%= appConfig.dist %>/images/generated'
            }
          ]
        }
      },
      svgmin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '<%= appConfig.app %>/images',
              src: path.join(relSubdirsGlob, '*.svg'),
              dest: '<%= appConfig.dist %>/images'
            }, {
              expand: true,
              cwd: '<%= appConfig.temp %>/images/generated',
              src: path.join(relSubdirsGlob, '*.svg'),
              dest: '<%= appConfig.dist %>/images/generated'
            }
          ]
        }
      },


      htmlmin: {
        dist: {
          options: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeOptionalTags: true
          },
          files: {
            expand: true,
            cwd: '<%= appConfig.dist %>',
            src: [path.join(relSubdirsGlob, '*.html')],
            dest: '<%= appConfig.dist %>'
          }
        }
      },


// Copies all files that don't migrate to where they are expected through a pre-processing plugin.  A given build should copy:dist or
// or copy:dev, but unlikely both.  Use copy:dist for running a dev build, and copy:dist for running/packaging a production build.
//
// Differences between the two copy sets are as follows:
// -- Only production builds need to copy generated images from staging?  They must be in the dist file tree for the filerev plugin
//    to find them and schedule them to receive a new randomized name suffix.
// -- The dev build acquires application code by Browserification, not direct copy.  But it does copy the Javascript spec files for
//    testing and it Coffee-compiles any spec files written in CoffeeScript.  The production build, in contrast, copies the
//    browserified application bundle and minifies it from under the dist tree.
//
// Less migrates all template-based CSS files to staging by writing their compiled output there, but it needs to copy hand-created .css
// files to get them under .tmp.  By the time dist wants them, they have already been concatenated and analysed for minification,
// but not yet minified.
//
// Less is to CSS as Coffee is to Javascript, so ditto for those types.
      copy: {
        build: {
          files: [
            {
              expand: true,
              cwd: '<%= appConfig.app %>',
              dest: '<%= appConfig.temp %>',
              src: [path.join('.', 'index.html')]
            },
            // I've not yet found a plugin that finds font assets within any given bower package.  There
            // are precious few that include them, which may in part explain the lack of such a plugin,
            // so I'm including logic for the most prevalent two: bootstrap and font-awesome.
            {
              expand: true,
              cwd: path.join('<%= appConfig.vendor %>', 'bootstrap-sass-official', 'assets', 'fonts'),
              dest: path.join('<%= appConfig.temp %>', 'fonts'),
              src: [allChildrenGlob]
            }, {
              expand: true,
              cwd: path.join('<%= appConfig.vendor %>', 'bootstrap', 'dist', 'fonts'),
              dest: path.join('<%= appConfig.temp %>', 'fonts'),
              src: [allChildrenGlob]
            }, {
              expand: true,
              cwd: path.join('<%= appConfig.vendor %>', 'font-awesome', 'fonts'),
              dest: path.join('<%= appConfig.temp %>', 'fonts'),
              src: [allChildrenGlob]
            }
          ]
        },
        dev: {
          files: [
            {
              dot: true,
              expand: true,
              cwd: '<%= appConfig.app %>',
              dest: '<%= appConfig.dev %>',
              src: [
                path.join('vendor', allChildrenGlob),
                path.join('styles', 'fonts', allChildrenGlob),
                path.join('fonts', allChildrenGlob),
                path.join('views', allExtGlob('html')),
                path.join('images', allExtGlob('{jpg,jpeg,gif,png,svg,webp}')),
                path.join('.', '*.{ico,png,txt}'),
                path.join('.', '.htaccess')
              ]
            }, {
              expand: true,
              cwd: '<%= appConfig.temp %>',
              dest: '<%= appConfig.dev %>',
              src: [
                path.join('images', 'generated', allExtGlob('{jpg,jpeg,gif,png,svg,webp}')),
                path.join('fonts', allChildrenGlob)
              ]
            }
          ]
        },
        dist: {
          files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= appConfig.app %>',
              dest: '<%= appConfig.dist %>',
              src: [
                path.join('styles', 'fonts', allChildrenGlob),
                path.join('fonts', allChildrenGlob),
                path.join('views', allExtGlob('html')),
                path.join('images', allExtGlob('webp')),
                path.join('.', '*.{ico,png,txt}'),
                path.join('.', '.htaccess')
              ]
            }, {
              expand: true,
              cwd: '<%= appConfig.temp %>',
              dest: '<%= appConfig.dist %>',
              src: [
                path.join('images', 'generated', allExtGlob('webp')),
                path.join('fonts', allChildrenGlob)
              ]
            }
          ]
        }
      },


      karma: {
        // Test settings
        unit: {
          // TODO: Can the config file exist in appConfig.app while all the scripts
          //       being tested are tested from <%= appConfig.app/>/test/karma.conf.js',
          configFile: '<%= appConfig.app %>/test/karma.conf.js',
          browsers: ['PhantomJS'],
          singleRun: true
        }
      },


      mochaTest: {
        common: {
          options: {
            quiet: false,
            reporter: 'spec',
            clearRequireCache: false
          },
          src: 'common/models/test/**/*.js'
        },
        server: {
          options: {
            quiet: false,
            reporter: 'spec',
            clearRequireCache: false
          },
          src: 'server/test/**/*.js'
        }
      }
    }
  );




// A Dev build is built in an environment with keep-alive enabled, such that connect will continue to run and observe
// changes after the build completes, allowing the developer to observe and work as needed.  The build includes a
// live reload. also unlike the test build, allowing the Connect server to recompile and expose the developer's latest
// work throughout the day.


// A distribution build uses configuration files to set port numbers and is concatenated, minified, uglified, compressed,
// and renamed to include a subsection of its MD5 checksum to mark uniqueness.  It is intended for production deployment,
// which begins with a pre-deployment staging areas for a final QA screen to confirm certification as a final safety
// precaution before the artifact is pushed live and released into the wild.  It includes a transient keep alive flag
// that keeps its Grunt creator running until the pre-deployment screen is completed.  If the result was a success,
// Gradle pushes the artifact into the deployment pipeline,
//
// Otherwise, the artifact is diverted to a locally stored queue where aborted releases await post-mortem analysis.

  grunt.registerTask(
    'makeBundle',
    'Create a dev browserify bundle',
    function(a, b, c, d) {
      console.log(grunt);
      console.log(a, b, c, d);
      var build = require('./build');
      build.buildLoopbackBundle(
        appConfig.app + '/scripts',
        appConfig.dev + '/scripts/app.js',
        this.async()
      );
    }
  );

  /**
   * Publish is likely not a real build step--deployment is most likely deferred to a higher
   * order project because UI is only a single piece of a larger application.
   *
   * TODO: Verify above prediction.  If it holds, then remove both publish and deploy tasks.
   */
  grunt.registerTask(
    'publish',
    ['clean:all', 'lint', 'build:dist', 'tests:dist', 'deploy']
  );
  grunt.registerTask(
    'deploy',
    'Deploy an archive for latest accepted release after having passed a re-verification run of acceptance tests.',
    function deployAcceptedRelease() {
      console.log('TBD');
    }
  );


  grunt.registerTask(
    'develop',
    ['clean:all', 'lint', 'build:dev', 'connect:develop', 'watch']
  );
  grunt.registerTask(
    'serve',
    ['clean:all', 'lint', 'build:dist', 'connect:serve']
  );
  grunt.registerTask(
    'candidate',
    ['clean:all', 'lint', 'build:dev', 'tests:dev', 'build:dist', 'tests:dist', 'bundle']
  );

  grunt.registerTask(
    'bundle',
    'Bundle an archive for a release candidate after passing all build tests.',
    function bundleReleaseCandidate() {
      console.log('TBD');
    }
  );
  grunt.registerTask(
    'tests',
    'TBD',
    function runUnitTestsWithDevBuild() {
      console.log('TBD');
    }
  );

  grunt.registerTask(
    'build:dev',
    ['expand', 'copy:dev', 'htmlbuild:dev', 'wiredep:dev', 'makeBundle:dev', 'modernizr:dev']
  );
  grunt.registerTask(
    'build:dist',
    [
      'expand', 'copy:dist', 'htmlbuild:dist', 'wiredep:dist',
      'browserify:dist', 'modernizr:dist', 'condense'
    ]
  );

  grunt.registerTask(
    'lint',
    ['coffeelint', 'jshint:build', 'coffeelint:test', 'jshint:test']
  );
  grunt.registerTask(
    'expand',
    ['sass', 'autoprefixer', 'jade', 'swagger-js-codegen', 'copy:build']
  );
  grunt.registerTask(
    'condense',
    [
      'useminPrepare:dist', 'concat:generated', 'cssmin:generated', 'uglify:generated',
      'svgmin:generated', 'imagemin:generated', 'filerev:dist', 'usemin:dist', 'htmlmin:dist'
    ]
  );

  grunt.registerTask('default', ['candidate']);
};
