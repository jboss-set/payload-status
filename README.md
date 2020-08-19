## Available branches

* master (this one) - an "offline" version of the app, the data are read from a local file, [deployed on OpenShift](http://payload-status-viewer-mpetrov-project.int.open.paas.redhat.com/)
* [json-fetching](https://gitlab.cee.redhat.com/mpetrov/payload-status-app/-/tree/json-fetching) - "live" version reading data from prbz-overview

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
