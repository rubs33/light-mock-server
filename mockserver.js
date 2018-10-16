/**
 * Library to register mocked routes to an Express Application.
 *
 * This library exports a class with the function "registerRoutes" that receives a config with an object like this:
 * {
 *   "routes": [
 *     {
 *       "method": "GET",
 *       "path": "/hello",
 *       "status": 200,
 *       "headers": {
 *         "content-type": "application/json"
 *       },
 *       "body": {
 *         "success": true
 *       }
 *     }
 *     ...
 *   ],
 *   "default404": {
 *     "headers": {
 *       "content-type": "application/json"
 *     },
 *     "body": {
 *       "message": "Resource not found"
 *     }
 *   }
 * }
 */
const lodash = require('lodash');

const mockserver = {

  defaultMethod: 'GET',
  defaultPath: '/*',
  defaultStatus: 200,
  defaultHeaders: {},
  defaultBody: 'OK',
  default404Body: 'Resource not found',
  default404Headers: {},

  /**
   * Register application routes based on config
   * @param express app Express application
   * @param object mockConfig Config data
   * @param object logger Object with logger methods (info, log, warn, error)
   * @return void
   */
  registerRoutes: (app, mockConfig, logger) => {
    const allowedMethods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'trace'];
    (mockConfig.routes || []).map((route) => {
      const method  = lodash.get(route, 'method', mockserver.defaultMethod).toLowerCase();
      const path    = lodash.get(route, 'path', mockserver.defaultPath);
      const status  = lodash.get(route, 'status', mockserver.defaultStatus);
      const headers = lodash.get(route, 'headers', mockserver.defaultHeaders);
      const body    = lodash.get(route, 'body', mockserver.defaultBody);

      logger.info(`Registering route to ${method} ${path}`);
      if (allowedMethods.indexOf(method) >= 0) {
        app[method](path, (req, res) => {
          res.status(status).set(headers).send(body);
        });
      } else {
        logger.warn(`Invalid method: ${method}`);
      }
    });

    // Register 404
    if (lodash.has(mockConfig, 'default404')) {
      const headers = lodash.get(mockConfig, 'default404.headers', mockserver.default404Headers);
      const body    = lodash.get(mockConfig, 'default404.body', mockserver.default404Body);

      logger.info('Registering middleware to 404');
      app.use((req, res, next) => {
        res.status(404).set(headers).send(body);
        next();
      });
    }
  },
};

module.exports = mockserver;
