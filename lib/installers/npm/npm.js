
/*
 * Module dependencies
 */
var Npm, npm, spawnSync, which,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

spawnSync = require('child_process').spawnSync;

require('colours');

which = require('which');


/*
 * Vars
 */

npm = module.exports = {};


/*
 * Class npm
 * @param options {Object} Options
 * @param loggr {Object} Logger
 */

Npm = (function(superClass) {
  extend(Npm, superClass);

  function Npm(options, logger) {
    this.options = options;
    this.logger = logger;
    this.logger.deb('Logger passed to Npm class.');
    this.npm_command = which.sync('npm');
  }


  /*
   * Set up args
   */

  Npm.prototype.setUpArgs = function() {
    if (typeof this.options.debug !== 'undefined' && this.options.debug && !this.options.noVerboseInstall) {
      this.npm_args.unshift('--verbose');
    }
    if (this.npm_options.hasOwnProperty('global') && this.npm_options.global) {
      return this.npm_args.push('-g');
    }
  };


  /*
   * Exec method
   * @param command {String} Command to run
   * @param
   */


  /*
   * Install method
   * @param packages {Array} Packages to install
   * @param options {Object} Options
   */

  Npm.prototype.install = function(packages, options) {
    var i, j, len, len1, o, oe, ref, ref1;
    this.logger.deb("Fetching packages " + "[".green + " " + (packages.toString().replace(/,/g, ', ').magenta) + "  " + "]".green + "...");
    this.npm_options = options;
    this.npm_args = packages;
    this.npm_args.unshift('install');
    this.setUpArgs();
    this.logger.deb("Command: " + ("\'" + this.npm_command + "\'").green);
    this.logger.deb("NPM args: " + "[".green + " " + (this.npm_args.toString().replace(/,/g, ', ').magenta) + "  " + "]".green + "...");
    this.logger.deb('Running...');
    this.logger.running(this.npm_command.cyan + " " + (this.npm_args.toString().replace(/,/g, ' ').cyan));
    this.npm_process = spawnSync(this.npm_command, this.npm_args);
    this.logger.deb("PID: " + this.npm_process.pid);
    this.npm_stdout = this.npm_process.stdout.toString('utf8').split('\n');
    this.npm_stderr = this.npm_process.stderr.toString('utf8').split('\n');
    ref = this.npm_stdout;
    for (i = 0, len = ref.length; i < len; i++) {
      o = ref[i];
      this.logger.stdout(o);
    }
    ref1 = this.npm_stderr;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      oe = ref1[j];
      if (oe.startsWith('npm verb') || oe.startsWith('npm info')) {
        this.logger.stdout(oe);
      } else {
        if (oe !== " ") {
          this.logger.stderr(oe);
        }
      }
    }
    if (this.npm_process.error) {
      throw this.npm_process.error;
    }

    /*
    @npm_process.stdout.on 'data', (data) ->
      console.log "data:"+data.toString('utf8')
    @npm_process.stderr.on 'data', (data) ->
      console.log "data:"+data.toString('utf8')
     */
  };

  return Npm;

})(Installer);

npm.Npm = Npm;