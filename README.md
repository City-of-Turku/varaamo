Varaamo
=======

[![Build Status](https://travis-ci.com/codepointtku/varaamo.svg?branch=develop)](https://travis-ci.com/digipointtku/varaamo)
[![codecov](https://codecov.io/gh/digipointtku/varaamo/branch/develop/graph/badge.svg)](https://codecov.io/gh/digipointtku/varaamo)
[![Requirements Status](https://requires.io/github/codepointtku/varaamo/requirements.svg?branch=develop)](https://requires.io/github/digipointtku/varaamo/requirements/?branch=develop)

User interface for the City of Turku [varaamo.turku.fi](https://varaamo.turku.fi/) resource reservation service. Uses the [respa API](https://varaamo.turku.fi:5010/v1/).

Recommended requirements
------------

- [node](http://nodejs.org/) `>=8.15.1` | Suggestion: `10.15.1`
- [npm](https://www.npmjs.com/) `>=6.4.1` | Suggestion: `6.4.1`
- [yarn](https://yarnpkg.com/) Optional, if `yarn` is not included as part of your current node version. `npm` can be used.

Architecture
------------

- [Redux](https://github.com/reactjs/redux) handles the state management of the app. For more info check their awesome [docs](http://redux.js.org/).
- [React](https://facebook.github.io/react/) handles the rendering of the 'views'.
- [react-redux](https://github.com/reactjs/react-redux) is used to connect the Redux Store to React components.
- [react-router](https://github.com/ReactTraining/react-router) handles the routing of the app.
- [reselect](https://github.com/reactjs/reselect) is used for getting data from Redux Store and manipulating it to be better usable in React components.
- [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) is used to interact with the API.
- The application is run on an [express](http://expressjs.com/) server.
- Uses [redux-oidc](https://github.com/maxmantz/redux-oidc) for authentication.
- [webpack](https://webpack.github.io/) takes modules with dependencies and generates static assets representing those modules.
- [Babel](https://babeljs.io/) transforms JavaScript written in ES2015 and JSX syntax to regular JavaScript.

Usage
-----

### Starting dockerized development server

1. Check if Docker and docker CLI installed, port `3000` is free, not occupied by running server.

2. Make sure you have env variables in `.env`, otherwise extend it from example by:
    ```
    $ cp .env.example .env
    ```
3. Start building docker image and start container:
    ```
    $ docker compose -f docker-compose.yml -f docker-compose.dev.yml up
    ```
4. Open `localhost:3000` on browser when Webpack bundling is ready.

### Starting dockerized production server

Starting production server works in the same way as starting a development server with these exceptions:

- Production default port is `8080`

- Starting production server with docker compose:
    ```
    $ docker compose -f docker-compose.yml -f docker-compose.prod.yml up
    ```

### Starting local development server

Follow the instructions below to set up the development environment.
By default the running app can be found at `localhost:3000`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Make sure you have the following env variables set in an .env file in the root of the project:
    Run command:
    ```
    $ cp .env.example .env
    ```

    OR prepare .env with default content:

    ```
    CLIENT_ID
    OPENID_AUDIENCE
    OPENID_AUTHORITY
    API_URL
    ADMIN_URL
    THEME_PKG
    ```

    Environment's variable guideline:

    - `API_URL`:
      Custom config to replace global application's api URL. Expected value is valid URL string.

    - `ADMIN_URL`:
      Custom config to replace global application's admin respa URL. Expected value is valid URL string.

    - `THEME_PKG`:
      Custom config to override global application's styling and texts.
      Expected value is a valid string that is the name of the theme package, e.g. `THEME_PMG='varaamo-theme'`. Default styles and texts will be used if not set.


3. Then, start the development server:

    ```
    $ npm start
    ```

### Starting production server

Follow the instructions below to build and start production server.
By default the running app uses port `8080`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Build the production bundle:

    ```
    $ npm build
    ```

3. Make sure you have the required env variables set.

4. Then, start the production server:

    ```
    $ npm start:production
    ```

### Running tests

- Run tests:

    ```
    $ npm test
    ```

- Run tests in watch mode:

    ```
    $ npm test:watch
    ```

- Run tests with coverage:

    ```
    $ npm test:coverage
    ```

### Running code linter

- To check the code for linting errors:

    ```
    $ npm lint
    ```
- To automate fixing lint:

    ```
    $ npm lint:fix
    ```
OR enable `eslint --fix` onSave config in your code editor config.

### Useful docker commands
- To rebuild the docker images:
    ```
    $ docker compose -f docker-compose.yml -f docker-compose.dev.yml up --force-recreate --build
    ```
- To enter inside docker container environment:
    ```
    $ docker compose exec node-app sh
    ```
- Remove docker container if needed:
    ```
    $ docker rm -f <container_name>
    ```
- Remove docker image:
    ```
    $ docker rmi varaamo_node-app
    ```
- Running command inside Docker environment:
(Make sure docker container is running)
    ```
    $ docker compose run node-app YOUR_COMMAND_HERE
    ```
- Encounter `node-sass` issue ? try to go inside docker container environment and run `npm rebuild node-sass`

Code style and linting
----------------------

The code mostly follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
All JavaScript should be written in ES2015 syntax.
Code is automatically linted with [eslint](http://eslint.org/) when running unit tests or bundling the app with webpack.

Styles and Stylesheets
----------------------

[Sass](http://sass-lang.com/) CSS extension language is used to make writing styles nicer. [Autoprefixer](https://github.com/postcss/autoprefixer) handles CSS vendor prefixes.
[Bootstrap](http://getbootstrap.com/) is used as the CSS framework for the site and [City of Helsinki Bootstrap theme](https://github.com/City-of-Helsinki/hel-bootstrap-3) is used as the main theme.

Custom themes
-----

A theme package can be installed to override the default styles and texts. In order to use a theme it must be installed/added locally
and then the env variable  `THEME_PKG` must be set accordingly `THEME_PKG='varaamo-theme'`.

See [example](https://github.com/codepointtku/varaamo-theme) for further explanation of how a theme package should look,be structured and what values can be overridden etc.

### Installation
Installation is the same for both development and production. If the theme package is published to npm/yarn then
this step can be skipped, just remember to set the name of the package as the `THEME_PKG='package-name'`.

For ease of use place the theme folder `varaamo-theme` next to the `varaamo` folder:
```
    /varaamo
    /varaamo-theme
```
and then in the `varaamo` project folder run `npm install ../varaamo-theme`.

Set `THEME_PKG='varaamo-theme'` to env variables.

### Development

Install the theme according to the installation instructions and then `npm link` the local theme package to
the local varaamo project.

```
cd ~/projects/varaamo-theme
npm link
cd ~/projects/varaamo
npm link varaamo-theme
```

Testing framework
-----------------

- [Jest](https://jestjs.io/) is used for running the tests and for test assertions. Running on [Jsdom](https://github.com/jsdom/jsdom) environment by default, which was a headless browser.
- [simple-mock](https://github.com/jupiter/simple-mock) and [MockDate](https://github.com/boblauer/MockDate) are used for mocking and spies.
- [Enzyme](https://github.com/airbnb/enzyme) is used to make testing React Components easier.

Running Vscode debugger
----------------------

All setting was included under .vscode directory.

- On Chrome:
    [Guideline](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code). Setting was under `Vscode debugger` name
- On Jest test:
    [Guideline](https://jestjs.io/docs/en/troubleshooting#debugging-in-vs-code). Setting was under `Vscode Jest debugger` name.

    - Put breakpoint in test file `(*.spec.js)`

    - Run command:

    ```
    $ yarn test:debug
    ```

License
-------

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019 City of Turku <[http://www.turku.fi/](http://www.turku.fi/)>
