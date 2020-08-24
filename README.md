## Experimental branch

This branch is taking advantage of the new REST API available in PRBZ-overview.

## Pre-requisites

### Wildfly settings

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

This branch is a little ahead of the current of version of PRBZ-overview, to see the latest features use these forks:

* Aphrodite - [branch 7.10.MP](https://github.com/michpetrov/aphrodite/tree/7.10.MP)
* PRBZ-overview - [branch payload-viewer](https://github.com/michpetrov/prbz-overview/tree/payload-viewer)

Deploy PRBZ-overview to WildFly and wait for everything to load (takes a few minutes)

## Running the app

Run as usual with `yarn start`.
