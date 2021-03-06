# Execute build
###
# Module dependencies
###
engines = require './engines/index'
plugins = require '../plugins/exec'
require 'colours'
###
# Vars
###
builder = module.exports = {}

###
# Execute method
###
builder.execBuild = (config, options, logger) ->
  # Here we build
  language = config.language
  logger.deb('Starting build for the correct language.')
  logger.deb("Language: #{"\'#{config.language}\'".green}")
  engine = new engines.nodejs.Builder(config, options, logger) if language == 'nodejs'
  engine = new engines.ruby.Builder(config, options, logger) if language == 'ruby'
  engine = new engines.c.Builder(config, options, logger) if language == 'c'
  engine = new engines.cpp.Builder(config, options, logger) if language == 'cpp'
  # Run pre-build plugins (before:build)
  plugins.run('before:build', logger, config)
  # Defaults
  logger.deb("Running defaults...")
  engine.default()
  logger.deb("Running build...")
  engine.start()
  # Run after-build plugins (before:build)
  plugins.run('after:build', logger, config)
