import shell       from '../dist/shell-escape-tag.js'
import test        from 'ava'
import { inspect } from 'util'

test('is aliased to shell.protect', t => {
    t.true(shell.protect === shell.preserve)
})

test('is aliased to shell.verbatim', t => {
    t.true(shell.verbatim === shell.preserve)
})

test('stringifies to the unescaped string', t => {
    t.true(shell.preserve('Foo Bar').toString() === 'Foo Bar')
    t.true(inspect(shell.preserve('Foo Bar')) === 'Foo Bar')
})

test('preserves a string with spaces', t => {
    t.true(shell.preserve('Foo Bar').value === 'Foo Bar')
})

test('preserves an array of strings with spaces', t => {
    t.is(
        shell.preserve([ 'Foo Bar', 'Baz Quux' ]).value,
        'Foo Bar Baz Quux'
    )
})

test('preserves a string with quotes', t => {
    t.is(
        shell.preserve(`Foo's "Bar"`).value,
        `Foo's "Bar"`
    )
})

test('preserves an array of strings with quotes', t => {
    t.is(
        shell.preserve([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
        `Foo's "Bar" Foo 'Bar' "Baz"`
    )
})

test('ignores null and undefined', t => {
    t.true(shell.preserve(null).value === '')
    t.true(shell.preserve(undefined).value === '')
})

test('ignores null and undefined array values', t => {
    t.is(
        shell.preserve([
            'Foo Bar',
            null,
            undefined,
            'Baz Quux'
        ]).value,
        `Foo Bar Baz Quux`
    )
})

test('stringifies defined values', t => {
    t.true(shell.preserve('').value === '')
    t.true(shell.preserve(false).value === 'false')
    t.true(shell.preserve(42).value === '42')
})

test('stringifies defined array values', t => {
    t.is(
        shell.preserve([
            'Foo Bar',
            0,
            '',
            false,
            'Baz Quux'
        ]).value,
        `Foo Bar 0  false Baz Quux`
    )
})

test('flattens nested array values', t => {
    t.is(
        shell.preserve([
            [ 'Foo Bar',
                [ 0, '', false,
                    [ null, undefined,
                        [ 'Baz Quux' ]
                    ]
                ]
            ]
        ]).value,
        `Foo Bar 0  false Baz Quux`
    )
})

test('preserves embedded strings', t => {
    const verbatim = shell.preserve('Foo Bar')
    t.true(shell`foo ${verbatim}` === 'foo Foo Bar')
})

test('preserves embedded arrays', t => {
    const verbatim = shell.preserve([ 'Foo Bar', 'Baz Quux' ])
    t.true(shell`foo ${verbatim}` === 'foo Foo Bar Baz Quux')
})

test('preserves embedded nested strings/arrays', t => {
    const verbatim = shell.preserve([
        '1 2',
        shell.preserve('3 4'),
        shell.preserve([ '5 6', '7 8' ]),
        '9 10'
    ])

    t.is(
        shell`foo ${shell.preserve(verbatim)} bar`,
        'foo 1 2 3 4 5 6 7 8 9 10 bar'
    )
})

test('supports embedded escapes', t => {
    const param = shell.preserve(shell.escape('foo bar'), [ "baz's quux" ])

    t.is(
        shell`command ${param}`,
        `command 'foo bar' baz's quux`
    )
})
