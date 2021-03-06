var Logger, app, async, execBuild, mkdirs, os, parseConfig, path, plugins, plugins_func, retis_plugin_dir;

Logger = require('./logger').Logger;

path = require('path');

parseConfig = require('./parser').parseConfig;

plugins = require('./plugins');

mkdirs = require('./mkdirs');

os = require('os');

execBuild = require('./builder/executer').execBuild;

async = require('async');

app = module.exports = {};

retis_plugin_dir = '.retis/plugins';

retis_plugin_dir = path.join(os.homedir(), retis_plugin_dir);

plugins_func = [];


/*
 * Build method
 * @param options {Object} Options
 */

app.build = function(options) {
  var _logger, config, i, len, p, ref;
  _logger = new Logger('retis', options);
  _logger.deb('Scanning for project specification...');
  _logger.deb("CWD: " + ("\'" + (process.cwd()) + "\'").green);
  config = parseConfig(options);
  if (config.hasOwnProperty('name')) {
    this.name = config.name;
  }
  if (process.platform !== 'win32' && config.hasOwnProperty('name') === false) {
    this.name = process.cwd().split("/");
  }
  if (process.platform === 'win32' && config.hasOwnProperty('name') === false) {
    this.name = process.cwd().split("\\");
  }
  if (config.hasOwnProperty('name') === false) {
    options.name = this.name[this.name.length - 1];
  }
  if (config.hasOwnProperty('name')) {
    options.name = this.name;
  }
  _logger.deb("Received config from parser.");
  _logger.deb("Starting build...");
  _logger.info("");
  if (config.hasOwnProperty('name') === false) {
    _logger.info("  Building \'" + this.name[this.name.length - 1] + "\'...");
  }
  if (config.hasOwnProperty('name') === true) {
    _logger.info("  Building \'" + this.name + "\'...");
  }
  _logger.info("");
  mkdirs(_logger);
  if (config.hasOwnProperty('plugins')) {
    ref = config.plugins;
    for (i = 0, len = ref.length; i < len; i++) {
      p = ref[i];
      plugins_func.push(function() {
        return plugins.fetchPlugin(p, options, function() {
          if (p === config.plugins[config.plugins.length - 1]) {
            return execBuild(config, options, _logger);
          } else {

          }
        });
      });
    }
    async.series(plugins_func);
  }
};
