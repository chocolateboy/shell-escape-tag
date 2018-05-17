import shell       from '../dist/shell-escape-tag.js'
import test        from 'ava'
import { inspect } from 'util'

test('stringifies to the escaped string', t => {
    t.true(shell.escape('Foo Bar').toString() === "'Foo Bar'")
    t.true(inspect(shell.escape('Foo Bar')) === "'Foo Bar'")
})

test('escapes a string with spaces', t => {
    t.true(shell.escape('Foo Bar').value === "'Foo Bar'")
})

test('escapes an array of strings with spaces', t => {
    t.is(
        shell.escape([ 'Foo Bar', 'Baz Quux' ]).value,
        "'Foo Bar' 'Baz Quux'"
    )
})

test('escapes a string with quotes', t => {
    t.is(
        shell.escape(`Foo's "Bar"`).value,
        `'Foo'"'"'s "Bar"'`
    )
})

test('escapes an array of strings with quotes', t => {
    t.is(
        shell.escape([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
        `'Foo'"'"'s "Bar"' 'Foo '"'"'Bar'"'"' "Baz"'`
    )
})

test('ignores null and undefined', t => {
    t.true(shell.escape(null).value === '')
    t.true(shell.escape(undefined).value === '')
})

test('ignores null and undefined array values', t => {
    t.is(
        shell.escape([
            'Foo Bar',
            null,
            undefined,
            'Baz Quux'
        ]).value,
        `'Foo Bar' 'Baz Quux'`
    )
})

test('stringifies defined values', t => {
    t.true(shell.escape('').value === '')
    t.true(shell.escape(false).value === 'false')
    t.true(shell.escape(42).value === '42')
})

test('stringifies defined array values', t => {
    t.is(
        shell.escape([
            'Foo Bar',
            0,
            '',
            false,
            'Baz Quux'
        ]).value,
        `'Foo Bar' 0  false 'Baz Quux'`
    )
})

test('flattens nested array values', t => {
    t.is(
        shell.escape([
            [ 'Foo Bar',
                [ 0, '', false,
                    [ null, undefined,
                        [ 'Baz Quux' ]
                    ]
                ]
            ]
        ]).value,
        `'Foo Bar' 0  false 'Baz Quux'`
    )
})

test("doesn't escape embedded escaped strings", t => {
    const escaped = shell.escape('Foo Bar')
    t.true(shell`foo ${escaped}` === "foo 'Foo Bar'")
})

test("doesn't escape embedded escaped arrays", t => {
    const escaped = shell.escape([ 'Foo Bar', 'Baz Quux' ])
    t.true(shell`foo ${escaped}` === "foo 'Foo Bar' 'Baz Quux'")
})

test("doesn't escape embedded nested strings/arrays", t => {
    const escaped = shell.escape([
        '1 2',
        shell.escape('3 4'),
        shell.escape([ '5 6', '7 8' ]),
        '9 10'
    ])

    t.is(
        shell`foo ${shell.escape(escaped)} bar`,
        "foo '1 2' '3 4' '5 6' '7 8' '9 10' bar"
    )
})

test('supports embedded preserves', t => {
    const param = shell.escape(shell.preserve('foo bar'), [ "baz's quux" ])

    t.is(
        shell`command ${param}`,
        `command foo bar 'baz'"'"'s quux'`
    )
})
