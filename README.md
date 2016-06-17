# shell-escape-tag

[![npm status](http://img.shields.io/npm/v/shell-escape-tag.svg)](https://www.npmjs.org/package/shell-escape-tag)
[![build status](https://secure.travis-ci.org/chocolateboy/shell-escape-tag.svg)](http://travis-ci.org/chocolateboy/shell-escape-tag)

An ES6+ template tag which escapes parameters for interpolation into shell commands

- [INSTALL](#install)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
- [EXPORTS](#exports)
  - [shell (default)](#shell-default)
    - [Methods](#methods)
      - [escape](#escape)
      - [preserve](#preserve)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

## INSTALL

    npm install shell-escape-tag

## SYNOPSIS

```javascript
import shell from 'shell-escape-tag'

let filenames = glob('Holiday Snaps/*.jpg')
let title     = 'Holiday Snaps'
let command   = shell`compress --title ${title} ${filenames}`

console.log(command) // compress --title 'Holiday Snaps' 'Holiday Snaps/Picture 1.jpg' 'Holiday Snaps/Picture 2.jpg'
```

## DESCRIPTION

This module exports an ES6+ tagged-template function which escapes (i.e. quotes) its parameters for safe inclusion in
shell commands. Parameters can be strings, arrays of strings, or nested arrays of strings, arrays and already-processed
parameters.

The exported function also provides two helper methods which respectively [escape](#escape) and [preserve](#preserve)
their parameters and protect them from further modification.

## EXPORTS

### shell (default)

**Signature**: (strings: Array[string], ...params: Any) -> command: string

```javascript
let filenames = [ 'foo bar', 'baz quux' ]
let title     = 'My Title'
let command   = shell`command --title ${title} ${filenames}`

console.log(command) // command --title 'My Title' 'foo bar' 'baz quux'
```

Takes a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings)
and escapes any interpolated parameters. `null` and `undefined` values are ignored
(i.e. mapped to an empty string). Arrays are flattened and their members are escaped and joined with a space.
All other values are stringified i.e. `false` is mapped to `"false"` &c.. Parameters that have been escaped
with [`shell.escape`](#escape) or preserved with [`shell.preserve`](#preserve) are passed through verbatim.

#### Methods

##### escape

**Signature**: ...Any -> Object

```javascript
let param = shell.escape([ "baz's quux" ])
let command = shell`command ${param}`

console.log(command) // command 'baz'"'"'s quux'
```

Flattens and escapes any parameters which haven't already been escaped or preserved, and returns an object which
is passed through verbatim when passed as a direct or nested parameter to the [`shell`](#shell-default) function.

##### preserve

**Aliases**: protect, verbatim

**Signature**: ...Any -> Object

```javascript
let param = shell.preserve([ "baz's quux" ])
let command = shell`command ${param}`

console.log(command) // command baz's quux
```

Flattens and preserves any parameters which haven't already been escaped or preserved, and returns an object which
is passed through verbatim when passed as a direct or nested parameter to the [`shell`](#shell-default) function.

## SEE ALSO

* [any-shell-escape](https://www.npmjs.com/package/any-shell-escape)

## VERSION

1.0.1

## AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

## COPYRIGHT AND LICENSE

Copyright © 2015 by chocolateboy

shell-escape-tag is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
