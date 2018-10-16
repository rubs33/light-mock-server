#!/usr/bin/env node
/**
 * Script that provides a configurable mock server.
 */
const express = require('express');
const lodash = require('lodash');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const mockserver = require('./mockserver');

const optionDefinitions = [
  { name: 'help', 'alias': 'h', type: Boolean, defaultValue: false },
  { name: 'file', alias: 'f', type: String },
  { name: 'config', alias: 'c', type: String, defaultValue: "{\"routes\": [{}]}" },
  { name: 'port', alias: 'p', type: Number, defaultValue: 3000 },
];

const helpMessage = `Options:
  -f [FILE], --file=[FILE]
    Read mock configuration from file (see example.json).
  -c [CONFIG], --config=[CONFIG]
    Specify mock configuration in command line.
  -p [PORT], --port=[PORT]
    Specify port to listen.
  -h, --help
    Print this help.
`;

class Main {

  /**
   * Run the main function.
   * @param object options Command line options.
   * @param object logger Object with logger methods (info, log, warn, error).
   * @return void
   */
  run(options, logger) {
    if (options.help) {
      process.stdout.write(this.getUsageMessage());
      return;
    }

    const app = this.buildApp(options, logger);
    logger.info('Starting mock server');
    app.listen(options.port, () => {
      logger.info(`Mock server listening on port ${options.port}!`);
    });
  }

  /**
   * Build an Express Application with mocked routes.
   * @param object options Command line options.
   * @param object logger Object with logger methods (info, log, warn, error).
   * @return Express application
   */
  buildApp(options, logger) {
    const app = express();
    app.disable('x-powered-by');
    app.disable('etag');

    const mockConfig = this.readConfig(options);
    mockserver.registerRoutes(app, mockConfig, logger);
    return app;
  }

  /**
   * Return usage message.
   * @return string
   */
  getUsageMessage() {
    return 'Usage:\n' +
      `$ node main.js [options]\n` +
      helpMessage;
  }

  /**
   * Build config object based on command line options or default value.
   * @param object options Command line options.
   * @return object Config data.
   */
  readConfig(options) {
    var jsonConfig = '';
    if (options.file) {
      jsonConfig = fs.readFileSync(options.file, 'utf8');
    } else if (options.config) {
      jsonConfig = options.config;
    } else {
      jsonConfig = '{"routes":[{}]}';
    }
    return JSON.parse(jsonConfig);
  }
}

if (require.main === module) {
  const options = commandLineArgs(optionDefinitions);
  const main = new Main();
  main.run(options, console);
}

module.exports = Main;
