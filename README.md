## Pre-requisites for running locally

### .env

Create a file named `.env` in the root folder with `REACT_APP_PRBZ_URL=http://localhost:8080/prbz-overview/rest/api/` (this will be ignored by git).

### Wildfly/EAP settings

Add a filter to Undertow settings to enable CORS

```
<subsystem xmlns="urn:jboss:domain:undertow:11.0" … >
    < … />
    <server name="default-server">
        < … />
        <host name="default-host" alias="localhost">
            < … />
            <filter-ref name="Access-Control-Allow-Origin"/>
        </host>
    </server>
    < … />
    <filters>
        <response-header name="Access-Control-Allow-Origin" header-name="Access-Control-Allow-Origin" header-value="http://localhost:3000"/>
    </filters>
</subsystem>
```

### PRBZ-overview

Get [here](https://github.com/jboss-set/prbz-overview)

Deploy PRBZ-overview and wait for everything to load (~30 mins)

## How to run

1. Install `yarn` (a dependency manager for JavaScript projects)
2. Run `yarn install && yarn start`

## Scripts

### `yarn install`

Installs dependencies, needs to be run only once unless dependencies have changed (`package.json`)

### `yarn start`

Starts a local server and opens a browser, in case nothing happens go to [http://localhost:3000/]([http://localhost:3000/]).

### `yarn build`

Builds the app, to deploy it copy the contents of the `build` folder.
