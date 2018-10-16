Documentation
=============

This project contains a simple Mock Server for HTTP.

Pre requisites
--------------

- npm >= 3.5.0
- node >= 8.10.0


Building
--------

Just run (it may require root or sudo access):
```
$ npm --global install light-mock-server
```

It will install the command `mockserver` globally, in the folder `bin` of node path.

To know more about global install, read this article: https://docs.npmjs.com/getting-started/installing-npm-packages-globally


Usage
-----

```
$ lightmockserver [OPTIONS]
Options:
  -f [FILE], --file=[FILE]
    Read mock configuration from file (see example.json).
  -c [CONFIG], --config=[CONFIG]
    Specify mock configuration in command line.
  -p [PORT], --port=[PORT]
    Specify port to listen (default 3000).
  -h, --help
    Print help.
```

Examples:

Starting a mock server at port 8080 with configuration file:
```
$ lightmockserver -f example.json -p 8080
```

Starting a mock server at port 8080 with plain configuration:
```
$ lightmockserver -p 8080 -c '{"routes": [{"path": "/hello", "body": "world"}]}'
```

Mock configuration
------------------

The JSON format used by configuration is intuitive:
```
{
  "default404": {
    "body": {
      "message": "resource not found"
    }
  },
  "routes": [
    {
      "method": "get",
      "path": "/hello/:id",
      "status": 200,
      "body": {
        "message": "hello"
      }
    },
    {
      "method": "post",
      "path": "/world",
      "status": 201,
      "headers": {
        "content-type": "text/plain"
      },
      "body": "created"
    }
  ]
}
```

The `default404` is optional and specify how the mock server will return responses for invalid routes (404).

The `routes` specifies an array of routes. Each one may have `method`, `path`, `status`, `headers` and `body`.

Note: the `body` can be a plain string or a JSON object.

Note: the path should be in the same format accepted by Express Framework (https://expressjs.com/pt-br/4x/api.html#path-examples).
