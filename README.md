# morph-auth-service

morph-auth-service - an webapi created using morph-cli

## Configuration

You can add .env file in you service home directory with settings:

```
PORT=your_preferred_listening_port_for_server
```

If no configuration is provided then the service listens by default on port 3001

## API

- GET / : returns JSON containing information about the name and version of the module and the number of the current version of the api:

```javascript
    {
        "moduleName": "morph-auth-service",
        "moduleVersion": "0.0.1",
        "latestApiVersion": "v1",
        "urlForInfo": "/api/v1/info",
        "urlForSwaggerDocs":"/docs"
    }
```
