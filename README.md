# shell-escape-tag

[![npm status](http://img.shields.io/npm/v/shell-escape-tag.svg)](https://www.npmjs.org/package/shell-escape-tag)
[![build status](https://secure.travis-ci.org/chocolateboy/shell-escape-tag.svg)](http://travis-ci.org/chocolateboy/shell-escape-tag)

An ES6+ template tag which escapes parameters for interpolation into shell commands

- [INSTALL](#install)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
- [EXPORTS](#exports)
  - [shell (default)](#shell-default)
    - [Functions](#functions)
      - [escape](#escape)
      - [preserve](#preserve)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

## INSTALL

    $ npm install shell-escape-tag

## SYNOPSIS

```javascript
import shell from 'shell-escape-tag'

let filenames = glob('Holiday Snaps/*.jpg')
let title     = 'Holiday Snaps'
let command   = shell`compress --title ${title} ${filenames}`

console.log(command) // compress --title 'Holiday Snaps' 'Holiday Snaps/Pic 1.jpg' 'Holiday Snaps/Pic 2.jpg'
```

## DESCRIPTION

This module exports an ES6+ tagged-template function which escapes (i.e. quotes) its parameters for safe inclusion in
shell commands. Parameters can be strings, arrays of strings, or nested arrays of strings, arrays and already-processed
parameters.

The exported function also provides two helper functions which respectively [escape](#escape) and [preserve](#preserve)
their parameters and protect them from further processing.

## EXPORTS

### shell (default)

**Signature**: template: String → command: String

```javascript
let filenames = [ 'foo bar', "baz's quux" ]
let title     = 'My Title'
let command   = shell`command --title ${title} ${filenames}`

console.log(command) // command --title 'My Title' 'foo bar' 'baz'"'"'s quux'
```

Takes a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
and escapes any interpolated parameters. `null` and `undefined` values are ignored.
Arrays are flattened and their members are escaped and joined with a space.
All other values are stringified i.e. `false` is mapped to `"false"` &c.. Parameters that have been escaped
with [`shell.escape`](#escape) or preserved with [`shell.preserve`](#preserve) are passed through verbatim.

#### Functions

##### escape

**Signature**: ...any → Object

```javascript
let params   = [ 'foo bar', "baz's quux" ]
let command1 = shell.escape('command', params)
let command2 = shell`command ${params}`

console.log(command1) // command 'foo bar' 'baz'"'"'s quux'
console.log(command2) // command 'foo bar' 'baz'"'"'s quux'
```

Flattens, compacts and escapes any parameters which haven't
already been escaped or preserved, joins the resulting elements
with a space, and wraps the resulting string in an object which
is passed through verbatim when passed as a direct or nested
parameter to [`shell`](#shell-default), [`shell.escape`](#escape),
or [`shell.preserve`](#preserve).

This function provides an alternate interface to the
[`shell`](#shell-default) tagged-template function i.e.

```javascript
shell.escape('foo', bar, 'baz', quux)
```

is equivalent to:

```javascript
shell`foo ${bar} baz ${quux}`
```

##### preserve

**Aliases**: protect, verbatim

**Signature**: ...any → Object

```javascript
let params   = [ 'foo bar', shell.preserve("baz's quux") ]
let command1 = shell.escape('command', params)
let command2 = shell`command ${params}`

console.log(command1) // command 'foo bar' baz's quux
console.log(command2) // command 'foo bar' baz's quux
```

Flattens, compacts and preserves any parameters which haven't already
been escaped or preserved, joins the resulting elements with a space,
and wraps the resulting string in an object which is passed through
verbatim when passed as a direct or nested parameter to
[`shell`](#shell-default), [`shell.escape`](#escape), or
[`shell.preserve`](#preserve).

## SEE ALSO

* [any-shell-escape](https://www.npmjs.com/package/any-shell-escape)
* [shell-tag](https://www.npmjs.com/package/shell-tag)

## VERSION

1.1.0

## AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

## COPYRIGHT AND LICENSE

Copyright © 2015-2017 by chocolateboy

shell-escape-tag is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
