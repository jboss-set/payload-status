## Experimental branch

This branch is taking advantage of the new REST API available in PRBZ-overview.

## Pre-requisites

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

Use the [latest SNAPSHOT](https://github.com/jboss-set/prbz-overview)

Deploy PRBZ-overview and wait for everything to load (~30 mins)

## Running the app

Run as usual with `yarn start`.
