[![Build Status](https://travis-ci.org/chocolateboy/shell-escape-tag.svg)](https://travis-ci.org/chocolateboy/shell-escape-tag)
[![NPM Version](https://img.shields.io/npm/v/shell-escape-tag.svg)](https://www.npmjs.org/package/shell-escape-tag)

<!-- TOC -->

- [NAME](#name)
- [INSTALL](#install)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
- [EXPORTS](#exports)
  - [shell (default)](#shell-default)
- [FUNCTIONS](#functions)
  - [shell.escape](#shellescape)
  - [shell.preserve](#shellpreserve)
- [DEVELOPMENT](#development)
- [COMPATIBILITY](#compatibility)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

<!-- TOC END -->

# NAME

shell-escape-tag - an ES6 template tag which escapes parameters for interpolation into shell commands

# INSTALL

    $ npm install shell-escape-tag

# SYNOPSIS

```javascript
import shell from 'shell-escape-tag'

let filenames = glob('Holiday Snaps/*.jpg')
let title     = 'Holiday Snaps'
let command   = shell`compress --title ${title} ${filenames}`

console.log(command) // compress --title 'Holiday Snaps' 'Holiday Snaps/Pic 1.jpg' 'Holiday Snaps/Pic 2.jpg'
```

# DESCRIPTION

This module exports an ES6 tagged-template function which escapes (i.e. quotes)
its parameters for safe inclusion in shell commands. Parameters can be strings,
arrays of strings, or nested arrays of strings, arrays and already-processed
parameters.

The exported function also provides two helper functions which respectively
[escape](#shellescape) and [preserve](#shellpreserve) their parameters and protect them
from further processing.

# EXPORTS

## shell (default)

**Signature**: (template: string) → string

```javascript
import shell from 'shell-escape-tag'

let filenames = ['foo bar', "baz's quux"]
let title     = 'My Title'
let command   = shell`command --title ${title} ${filenames}`

console.log(command) // command --title 'My Title' 'foo bar' 'baz'"'"'s quux'
```

Takes a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
and escapes any interpolated parameters. `null` and `undefined` values are
ignored. Arrays are flattened and their elements are escaped and joined with a
space. All other values are stringified i.e. `false` is mapped to `"false"`
etc. Parameters that have been escaped with [`shell.escape`](#shellescape) or
preserved with [`shell.preserve`](#shellpreserve) are passed through verbatim.

# FUNCTIONS

## shell.escape

**Signature**: (...args: any[]) → object

```javascript
import shell from 'shell-escape-tag'

let escaped = shell.escape("foo's bar")
let command1 = `command ${escaped}`
let command2 = shell`command ${escaped}`

console.log(command1) // command 'foo'"'"'s bar'
console.log(command2) // command 'foo'"'"'s bar'
```

Flattens, compacts and escapes any parameters which haven't already been
escaped or preserved, joins the resulting elements with a space, and wraps the
resulting string in an object which remains escaped when embedded in a template
or passed as a direct or nested parameter to [`shell`](#shell-default),
[`shell.escape`](#shellescape), or [`shell.preserve`](#shellpreserve).

## shell.preserve

**Aliases**: protect, verbatim

**Signature**: (...args: any[]) → object

```javascript
import shell from 'shell-escape-tag'

let preserved = shell.preserve("baz's quux")
let command1 = `command "${preserved}"`
let command2 = shell`command "${preserved}"`

console.log(command1) // command "baz's quux"
console.log(command2) // command "baz's quux"
```

Flattens, compacts and preserves any parameters which haven't already been
escaped or preserved, joins the resulting elements with a space, and wraps the
resulting string in an object which is passed through verbatim when embedded in
a template or passed as a direct or nested parameter to
[`shell`](#shell-default), [`shell.escape`](#shellescape), or
[`shell.preserve`](#shellpreserve).

# DEVELOPMENT

<details>

<!-- TOC:ignore -->
## NPM Scripts

The following NPM scripts are available:

- build - compile the code and save it to the `dist` directory
- build:doc - generate the README's TOC (table of contents)
- clean - remove the `dist` directory and other build artifacts
- rebuild - clean the build artifacts and recompile the code
- test - clean and rebuild and run the test suite
- test:run - run the test suite

</details>

# COMPATIBILITY

- [Maintained Node.js versions](https://github.com/nodejs/Release#readme) (and compatible browsers)

# SEE ALSO

- [any-shell-escape](https://www.npmjs.com/package/any-shell-escape) - escape and stringify an array of arguments to be executed on the shell
- [execa](https://www.npmjs.com/package/execa) - a better `child_process`
- [@perl/qw](https://www.npmjs.com/package/@perl/qw) - a template tag for quoted word literals like Perl's `qw(...)`
- [@perl/qx](https://www.npmjs.com/package/@perl/qx) - a template tag to run a command and capture its output like Perl's `qx(...)`
- [puka](https://www.npmjs.com/package/puka) - a cross-platform library for safely passing strings through shells

# VERSION

2.0.2

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2015-2020 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the terms
of the [Artistic License 2.0](https://www.opensource.org/licenses/artistic-license-2.0.php).
