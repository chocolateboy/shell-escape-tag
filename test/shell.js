import shell from '..'
import test  from 'ava'

test('escapes an empty string', t => {
    t.is(shell``, '')
})

test('ignores null values', t => {
    t.is(shell`foo${null}bar`, 'foobar')
})

test('ignores undefined values', t => {
    t.is(shell`foo${undefined}bar`, 'foobar')
})

test('ignores null and undefined values', t => {
    const bar = [ null, undefined, 'bar', undefined, null ]
    t.is(shell`foo${bar}baz`, 'foobarbaz')
})

test('does not ignore empty strings', t => {
    const bar = [ '', 'bar', '' ]
    t.is(shell`foo${bar}baz`, 'foo bar baz')
})

test('escapes a string with no interpolations', t => {
    t.is(shell`foo`, 'foo')
    t.is(shell`foo bar`, 'foo bar')
    t.is(shell`foo bar baz`, 'foo bar baz')
})

test('escapes a string which only contains an interpolation', t => {
    const foo = 'Foo'
    t.is(shell`${foo}`, 'Foo')
})

test('escapes a string which only contains interpolations', t => {
    const foo = 'Foo'
    const bar = 'Bar'
    const baz = 'Baz'

    t.is(shell`${foo}${bar}${baz}`, 'FooBarBaz')
})

test('escapes a string which starts with an interpolation', t => {
    const foo = 'Foo'

    t.is(shell`${foo}bar`, 'Foobar')
    t.is(shell`${foo} bar`, 'Foo bar')
})

test('escapes a string which starts with interpolations', t => {
    const foo  = 'Foo'
    const bar  = 'Bar'
    const baz  = 'Baz'

    t.is(shell`${foo}${bar}${baz}quux`, 'FooBarBazquux')
    t.is(shell`${foo} ${bar} ${baz} quux`, 'Foo Bar Baz quux')
})

test('escapes a string which ends with an interpolation', t => {
    const foo = 'Foo'

    t.is(shell`foo${foo}`, 'fooFoo')
    t.is(shell`foo ${foo}`, 'foo Foo')
})

test('escapes a string which ends with interpolations', t => {
    const foo = 'Foo'
    const bar = 'Bar'
    const baz = 'Baz'

    t.is(shell`foo${foo}${bar}${baz}`, 'fooFooBarBaz')
    t.is(shell`foo ${foo} ${bar} ${baz}`, 'foo Foo Bar Baz')
})

test('escapes a string with spaces', t => {
    const foo = 'Foo Bar'
    t.is(shell`foo ${foo}`, "foo 'Foo Bar'")
})

test('escapes an array of strings with spaces', t => {
    const foo = [ 'Foo Bar', 'Baz Quux' ]
    t.is(shell`foo ${foo}`, "foo 'Foo Bar' 'Baz Quux'")
})

test('escapes a string with quotes', t => {
    const foo = `Foo's 'Bar' "Baz"`

    t.is(
        shell`foo ${foo} bar`,
        `foo 'Foo'"'"'s '"'"'Bar'"'"' "Baz"' bar`
    )
})

test('escapes an array of strings with quotes', t => {
    const foo = [ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]

    t.is(
        shell`foo ${foo} bar`,
        `foo 'Foo'"'"'s "Bar"' 'Foo '"'"'Bar'"'"' "Baz"' bar`
    )
})
