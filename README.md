# Library Web UI

Simple hypermedia-driven library application. Supports Hydra (http://www.hydra-cg.com/), json-ld (http://json-ld.org/) and popular vocabulary http://schema.org/

## Requirements
Due to depended library complexity, this application should be run only on:
* Nginx server. Apache has some sort of problems
* PHP < 7.0.0
* Composer

If you want to develop/extend the app, you also may need:
* Node.js for sass and js compiling

## Installation
#### For using:
- Clone to your nginx folder: `git clone https://github.com/Omenstudio/hypermedia-library-web-ui`
- Install dependencies via composer: `composer composer.phar install`. For Windows you may need to manually setup path to composer.phar
- Run in your browser

#### For development:
- Install Node.js, if not installed yet. Then install Gulp globally via `npm install --global gulp`
- All sass and js sources located in directory gulp: `cd gulp`
- Install all dependencies: `npm install` 
- Run gulp via `gulp`

Default Gulp task include browser-sync, sass "compilation" and js minification.


## See also
- Hypermedia micro-framework for backend development: https://github.com/Omenstudio/hydra-microframework
- Hypermedia web API service, which use Hydra and Json-ld: https://github.com/Omenstudio/library-hypermedia-service-books
- Hypermedia web API service, which use Hydra and Json-ld: https://github.com/Omenstudio/library-hypermedia-service-articles
- Based on the original [HydraConsole](https://github.com/lanthaler/HydraConsole) application.
