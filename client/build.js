(function() {
  // TODO: Take directory locations of angular code and common components as arguments!
  // TODO: Also take the names of the common component roots as an argument!
  module.exports = {
    ngClientRemapFilter: ngClientRemapFilter,
    commonRemapFilter: commonRemapFilter,
    buildLoopbackBundle: buildLoopbackBundle
  };

  var fs         = require('fs'),
      path       = require('path'),
      browserify = require('browserify'),
      remapify   = require('remapify'),
      _          = require('lodash'),
      pkg        = require('../package.json');

  /**
   * Applies the alias name transformation rule for angular application scripts using this project's file layout
   * style guide.
   *
   * The resulting names follow one of four conventions, where:
   * -- / is a filesystem separator, '/' on Unix or '\\' on Windows.
   * -- <modulePath> is a filesystem path leading from the root angular scripts directory to file being aliased.
   * -- <moduleFQN> is a module's fully qualified name, as derived from <modulePath> by replacing <fsSep> with '.'.
   * -- <moduleName> is a module's unqualified local name, which is the last name from its <modulePath>.
   * -- <fileExtension> is the extension of the file being aliases, either '.js', or '.coffee'.
   * -- <fileToken> is the name of the file being aliased, absent its '.js' or '.coffee' extension.
   * -- <fileName> is the concatenation of <fileToken> and <fileExtension>.
   *
   * The four naming rules are as follows:
   * -- Module definition scripts: <modelFQN> -> <modulePath>/<moduleName><fileExtension>
   * -- Module config phase scripts: <modelFQN>/config -> <modulePath>/<moduleName>.config<fileExtension>
   * -- Module run phase scripts: <modelFQN>/run -> <modulePath>/<moduleName>.run<fileExtension>
   * -- Module registered subunit scripts: <modelFQN>/<fileToken> -> <modulePath>/<fileName>
   *
   * @param {string} alias
   * @param {string} dirname
   * @param {string} basename
   * @returns {string} An angularized alias name if the transformation was applicable, otherwise the original alias.
   */
  function ngClientRemapFilter(alias, dirname, basename) {
    // Tolerate Windows and Unix path separators, just like Browserify and Remapify do.
    var retVal = alias, moduleFQN = undefined, sepToken = {regexp: undefined, join: undefined};

    // Identify which rewrite rule to apply by figuring out which rule's separator character is present
    // in the current input alias.
    _.find(
      [ {regexp: /\//g, join: '\/'}, {regexp: /\\/g, join: '\\'} ],
      function (sep) {
        if (sep.regexp.test(alias)) {
          moduleFQN = dirname.replace(sep.regexp, '.');
          sepToken = sep;
          return true;
        }

        return false;
      }
    );

    // If moduleFQN is now set, then we identified which separator rewrite rule applies.
    if (_.isUndefined(moduleFQN) == false) {
      // Get the file name for comparing with the module name, but remember that we cannot lose .coffee
      // suffixes the same way that we can lose .js suffixes here!
      var fileNameToken = basename.replace(/\.js$/, '');
      var fileCompareToken = fileNameToken;
      if(fileNameToken != basename) {
      } else if (/\.coffee$/.test(basename)) {
        fileCompareToken = basename.replace(/\.coffee$/, '');
      } else {
        console.warn(
          "Could not recognize a known file suffix for " + basename +
          ".  Returning input alias unmodified: " + alias
        );
        return alias;
      }

      // Use file naming conventions to infer which transformation applies to base filename.
      var moduleName = _.last(moduleFQN.split('.'));
      console.log(moduleName, ':', fileCompareToken);
      if (fileCompareToken == moduleName) {
        // This entry is a module definition script.  It will be named for require using only its fully qualified
        // module name (e.g. require('fh-mgr.site.navigation')).
        retVal = moduleFQN;
      }
      else {
        console.log('else', fileCompareToken, fileNameToken, moduleName, '.config/run');
        if (fileCompareToken == moduleName + '.config') {
          if (fileNameToken == fileCompareToken) {
            fileNameToken = 'config';
          } else {
            fileNameToken = 'config.coffee';
          }
        }
        else
          if (fileCompareToken == moduleName + '.run') {
            if (fileNameToken == fileCompareToken) {
              fileNameToken = 'run';
            } else {
              fileNameToken = 'run.coffee';
            }
          }

        // This entry is for part of a module's contents.  It will be named for require using a combination of its fully
        // qualified name and its file token, with a separator character sequence separating the two.  For example,
        // 'HomeController.controller.js' under Unix directory path fh-mgr/site/navigator would be named for require
        // as 'fh-mgr.site.navigation/HomeController.controller'.  The equivalent alias also provide for Windows systems
        // would be 'fh-mgr.site.navigation\\HomeController.controller'.
        //
        // NOTE: There are special rules for the special "config" and "run" subsections of a module.  These are both
        // recognized by appending a designated suffix to the module's unqualified name, but they are named for require
        // by applying the above combination rule to just the designated suffix.  For example, 'navigation.config' under
        // unix folder path fh-mgr/site/navigation would be named for require as 'fh-mgr.site.navigation/config'.  On a
        // Windows system, the same import could also be named 'fh-mgr.site.navigation\\config'.
        retVal = [moduleFQN, fileNameToken].join(sepToken.join);
      }

      console.log('Transformed ' + alias + ' to ' + retVal + ' for ' + dirname + sepToken.join + basename);
    } else {
      // Neither separator re-write rule was applicable, so return the alias unmodified.
      console.warn('Retaining ' + retVal + ' for ' + dirname + '->' + basename);
    }

    return retVal;
  }


  /**
   * Remapify filter function for file paths shared by both client and server.
   *
   * This filter must be used as a partial function by calling _.partial(commonRemapFilter, <commonComponentName>) where
   * commonComponentName names the subdirectory of common components being mapped before passing it to remapify.
   *
   * If the directory structure under the commonComponentName subdirectory for common components has any degree of nesting,
   * any path through those inner directories is considered to represent a module name.  Files at the root of a named common
   * component type are treated as having no module.  Module names are derived by replacing filesystem separators with '.'.
   *
   * The names this filter produces have two elements separated by a filesystem separator character for files without a
   * module qualifier, and three element for those which have a module qualifier.
   *
   * For example:
   * <componentDir>/repository/RepositoryService.js -> require('repository:RepositoryService')    ** unqualified form **
   * <componentDir>/models/fh-mgr/core/Enum.coffee -> require('models:fh-mgr.core/Enum')        ** fully qualified form **
   *
   * NOTE: To avoid collisions with the angular application, do not use same name for both the angular application root module
   * and a common component, and do not use '.' in the name of any common component's root subdirectory.
   * TODO: Look for painless ways to avoid potential collisions between the client and common namespaces for require().
   *
   * @param {string} componentName Name of a common component's subdirectory.  Bind this parameter through
   *                               _.partial() before using this filter in a remapify pattern block!!
   * @param {string} alias Remapify-proposed default alias name based on its default generator rules.
   * @param {string} dirname
   * @param {string} basename
   * @returns {string} An alias name transformed by common component style guide policies or the original
   *                   alias name if no rewrite rule's preconditions matched.
   */
  function commonRemapFilter(componentName, alias, dirname, basename) {
    // Tolerate Windows and Unix path separators, just like Browserify and Remapify do.
    var retVal = alias, moduleFQN = undefined;

    // Infer the module's fully qualified name and identify its separator character by figuring out
    // which separator changes dirname when replaced by '.'
    var sepToken = _.find(
      [{ regexp: /\//g, join: '\/' }, { regexp: /\\/g, join: '\\' }],
      function(sep) {
        if (sep.regexp.test(alias)) {
          moduleFQN = dirname.replace(sep.regexp, '.');
          // sepToken = sep;
          return true;
        }

        return false;
      }
    ) || { regexp: undefined, join: undefined };

    var fileToken = undefined;
    _([/\.js$/, /\.coffee$/]).find(function(suffix) {
      fileToken = basename.replace(suffix, '');
      return fileToken != basename;
    });

    if (moduleFQN != '.') {
      retVal = [
        componentName,
        [moduleFQN, fileToken].join(sepToken.join)
      ].join(':');

      // console.log('Transformed ' + alias + ' for ' + dirname + sepToken.join + basename + ' of ' + componentName + ' to ' + retVal);
    } else if (_.isUndefined(moduleFQN) == false) {
      retVal = [componentName, fileToken].join(':');

      // console.log('Transformed ' + alias + ' for ' + dirname + '->' + basename + ' of ' + componentName + ' to ' + retVal);
    } else {
      // If basedir defied re-write to a module FQN, but because it was equal to '.', leave the original alias unmodified.
      // console.log('Retaining ' + retVal + ' for ' + dirname + '->' + basename + ' of ' + componentName + ' unmodified.');
    }

    return retVal;
  }

  function buildLoopbackBundle(
    env, angularScriptsDir, commonComponentsDir, commonComponentNames, buildOutputDir, callback )
  {
    var isDevEnv      = ['debug', 'development', 'test'].indexOf(env) >= 0,
        bundlePath    = path.join(buildOutputDir, 'app.bundle.js'),
        sourceMapPath = path.join(buildOutputDir, 'app.bundle.js.map');

    // TODO(bajtos) debug should be always true, the source maps should be
    // saved to a standalone file when !isDev(env)
    // TODO(jch) Assess https://github.com/thlorenz/exorcist#usage as a
    // non-dev build extra step for extracting source maps from the bundle
    // after generating it.  Browserify does not seem to have an option for
    // generating them outside the bundle, but this tool is capable of
    // extracting them after-the-fact.
    var sourceGlob     = path.join('**', '*.{js,coffee}'),
        b = browserify({basedir: __dirname}, {debug: true /*isDevEnv*/);

    // Filter out this script's own output.
    b.exclude(bundlePath).ignore(bundlePath);
    b.ignore(sourceMapPath).exclude(sourceMapPath);

    // Handle .coffee files
    b.transform('coffeeify');
    b._extensions.push('.coffee');

    // Configure browserify to load the angular application's main module at end of bundle definition script's execution.
    var mainModuleFile = path.join(angularScriptsDir, pkg.main);
    console.log(mainModuleFile);
    b.require(mainModuleFile /*, {expose: 'fh-mgr'}*/);

    /*
    // Debug verbosity--see what the bundle's remapify filters did and what files satisfied either input pattern.
    b.on('remapify:files', function(files, expandedRemaps, pattern){
      console.log('Files:', files);
      console.log('Expanded Remaps:', expandedRemaps);
      console.log('Pattern:', pattern);
    });
    */

    // Configure remapify to select common and App client files and apply project policy for naming commonjs
    // packages that bundle both angular client code and common components.
    b.plugin(
      remapify,
      _.flatten([  // Otherwise the _.map() would result in passing a 2D matrix, not a 1D array
        {
          src: sourceGlob,
          cwd: angularScriptsDir,
          filter: filterAngularRemap
        },
        _.map(
          commonComponentNames,
          function getComponentPattern(componentName) {
            return {
              src: sourceGlob,
              cwd: path.join(commonComponentsDir, componentName),
              filter: _.partial(filterCommonRemap, componentName)
            }
          }
        )
      ])
    );

    /*try {
     boot.compileToBrowserify({
     angularScriptsDir: appRootDir,
     env: env
     }, b);
     } catch(err) {
     return callback(err);
     }*/

    // Prepare and execute the output pipeline from Browserify runtime to local filesystem.
    var out = fs.createWriteStream(bundlePath);

    // All streams in the pipeline should invoke callback as their onError event handler.
    out.on('error', callback);

    // Only the last stream in the pipeline should invoke callback as its onClose event handler.
    out.on('close', callback);

    if (isDevEnv) {
      var exorcist      = require('exorcist'),
          sourceMapOut  = exorcist(sourceMapPath, 'scripts/app.bundle.js.map', 'scripts');

      sourceMapOut.pipe(out);
      out = sourceMapOut;
      out.on('error', callback);
    }

    // Connect the first stream of the output pipeline to browserify's bundle builder and let it run!
    b.bundle().on('error', callback).pipe(out);
  }
}).call(this);
