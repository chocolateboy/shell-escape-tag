## 1.2.1 - 2018-05-18

- fix documentation error

## 1.2.0 - 2018-05-18

- code:

  - allow (but don't require) the module to be required without
    the unsightly .default detour i.e. both of these now work:
    - require("shell-escape-tag").default
    - require("shell-escape-tag")
  - fix warning in node v6.6.0 and above by using
    the new inspect-hook API

- build:

  - migrate from Babel 6 to Babel 7
  - migrate from Mocha to AVA
  - update dependencies

## 1.1.0 - 2017-01-02

- build:

  - migrate Babel 5 to Babel 6
  - migrate Grunt to Gulp 4
  - migrate npm to yarn + lockfile
  - update dependencies

- code:

  - add additional tests for null/undefined pruning
  - re-remove lodash.isarray (thanks, TehShrike)

- changelog:

  - add timestamps
  - fix formatting

## 1.0.2 - 2016-06-17

- reinstate lodash.isarray for backwards compatibility
- doc tweaks

## 1.0.1 - 2016-06-17

- narrow the scope of the lodash import (TehShrike)

## 1.0.0 - 2015-09-14

- add changelog to package files

## 0.0.2 - 2015-09-14

- add `.travis.yml`
- add changelog
- add Travis and NPM badges

## 0.0.1 - 2015-02-16

- initial release
