import assert      from 'power-assert';
import shell       from '../../src/shell-escape-tag.js';
import { inspect } from 'util';

import 'source-map-support/register';

describe('shell', () => {
    it('escapes an empty string', () => {
        assert(shell`` === '');
    });

    it('escapes a string with no interpolations', () => {
        assert(shell`foo` === 'foo');
        assert(shell`foo bar` === 'foo bar');
        assert(shell`foo bar baz` === 'foo bar baz');
    });

    it('escapes a string which only contains an interpolation', () => {
        let foo = 'Foo';
        assert(shell`${foo}` === 'Foo');
    });

    it('escapes a string which only contains interpolations', () => {
        let foo = 'Foo';
        let bar = 'Bar';
        let baz = 'Baz';
        assert(shell`${foo}${bar}${baz}` === 'FooBarBaz');
    });

    it('escapes a string which starts with an interpolation', () => {
        let foo = 'Foo';
        assert(shell`${foo}bar` === 'Foobar');
        assert(shell`${foo} bar` === 'Foo bar');
    });

    it('escapes a string which starts with interpolations', () => {
        let foo  = 'Foo';
        let bar  = 'Bar';
        let baz  = 'Baz';
        assert(shell`${foo}${bar}${baz}quux` === 'FooBarBazquux');
        assert(shell`${foo} ${bar} ${baz} quux` === 'Foo Bar Baz quux');
    });

    it('escapes a string which ends with an interpolation', () => {
        let foo = 'Foo';
        assert(shell`foo${foo}` === 'fooFoo');
        assert(shell`foo ${foo}` === 'foo Foo');
    });

    it('escapes a string which ends with interpolations', () => {
        let foo = 'Foo';
        let bar = 'Bar';
        let baz = 'Baz';
        assert(shell`foo${foo}${bar}${baz}` === 'fooFooBarBaz');
        assert(shell`foo ${foo} ${bar} ${baz}` === 'foo Foo Bar Baz');
    });

    it('escapes a string with spaces', () => {
        let foo = 'Foo Bar';
        assert(shell`foo ${foo}` === "foo 'Foo Bar'");
    });

    it('escapes an array of strings with spaces', () => {
        let foo = [ 'Foo Bar', 'Baz Quux' ];
        assert(shell`foo ${foo}` === "foo 'Foo Bar' 'Baz Quux'");
    });

    it('escapes a string with quotes', () => {
        let foo = `Foo's 'Bar' "Baz"`;

        assert.strictEqual(
            shell`foo ${foo} bar`,
            `foo 'Foo'"'"'s '"'"'Bar'"'"' "Baz"' bar`
        );
    });

    it('escapes an array of strings with quotes', () => {
        let foo = [ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ];

        assert.strictEqual(
            shell`foo ${foo} bar`,
            `foo 'Foo'"'"'s "Bar"' 'Foo '"'"'Bar'"'"' "Baz"' bar`
        );
    });
});

describe('shell.escape', () => {
    it("stringifies to the escaped string", () => {
        assert(shell.escape('Foo Bar').toString() === "'Foo Bar'");
        assert(inspect(shell.escape('Foo Bar')) === "'Foo Bar'");
    });

    it("escapes a string with spaces", () => {
        assert(shell.escape('Foo Bar').value === "'Foo Bar'");
    });

    it("escapes an array of strings with spaces", () => {
        assert.strictEqual(
            shell.escape([ 'Foo Bar', 'Baz Quux' ]).value,
            "'Foo Bar' 'Baz Quux'"
        );
    });

    it("escapes a string with quotes", () => {
        assert.strictEqual(
            shell.escape(`Foo's "Bar"`).value,
            `'Foo'"'"'s "Bar"'`
        );
    });

    it('escapes an array of strings with quotes', () => {
        assert.strictEqual(
            shell.escape([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
            `'Foo'"'"'s "Bar"' 'Foo '"'"'Bar'"'"' "Baz"'`
        );
    });

    it("ignores null and undefined", () => {
        assert(shell.escape(null).value === '');
        assert(shell.escape(undefined).value === '');
    });

    it("ignores null and undefined array values", () => {
        assert.strictEqual(
            shell.escape([
                'Foo Bar',
                null,
                undefined,
                'Baz Quux'
            ]).value,
            `'Foo Bar' 'Baz Quux'`
        );
    });

    it("stringifies defined values", () => {
        assert(shell.escape('').value === '');
        assert(shell.escape(false).value === 'false');
        assert(shell.escape(42).value === '42');
    });

    it("stringifies defined array values", () => {
        assert.strictEqual(
            shell.escape([
                'Foo Bar',
                0,
                '',
                false,
                'Baz Quux'
            ]).value,
            `'Foo Bar' 0  false 'Baz Quux'`
        );
    });

    it("flattens nested array values", () => {
        assert.strictEqual(
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
        );
    });

    it("doesn't escape embedded escaped strings", () => {
        let escaped = shell.escape('Foo Bar');
        assert(shell`foo ${escaped}` === "foo 'Foo Bar'");
    });

    it("doesn't escape embedded escaped arrays", () => {
        let escaped = shell.escape([ 'Foo Bar', 'Baz Quux' ]);
        assert(shell`foo ${escaped}` === "foo 'Foo Bar' 'Baz Quux'");
    });

    it("doesn't escape embedded nested strings/arrays", () => {
        let escaped = shell.escape([
            '1 2',
            shell.escape('3 4'),
            shell.escape([ '5 6', '7 8' ]),
            '9 10'
        ]);

        assert.strictEqual(
            shell`foo ${shell.escape(escaped)} bar`,
            "foo '1 2' '3 4' '5 6' '7 8' '9 10' bar"
        );
    });

    it('supports embedded preserves', () => {
        let param = shell.escape(shell.preserve('foo bar'), [ "baz's quux" ])

        assert.strictEqual(
            shell `command ${param}`,
            `command foo bar 'baz'"'"'s quux'`
        );
    });
});

describe('shell.preserve', () => {
    it("is aliased to shell.protect", () => {
        assert(shell.protect === shell.preserve);
    });

    it("is aliased to shell.verbatim", () => {
        assert(shell.verbatim === shell.preserve);
    });

    it("stringifies to the unescaped string", () => {
        assert(shell.preserve('Foo Bar').toString() === 'Foo Bar');
        assert(inspect(shell.preserve('Foo Bar')) === 'Foo Bar');
    });

    it("preserves a string with spaces", () => {
        assert(shell.preserve('Foo Bar').value === 'Foo Bar');
    });

    it("preserves an array of strings with spaces", () => {
        assert.strictEqual(
            shell.preserve([ 'Foo Bar', 'Baz Quux' ]).value,
            "Foo Bar Baz Quux"
        );
    });

    it("preserves a string with quotes", () => {
        assert.strictEqual(
            shell.preserve(`Foo's "Bar"`).value,
            `Foo's "Bar"`
        );
    });

    it('preserves an array of strings with quotes', () => {
        assert.strictEqual(
            shell.preserve([ `Foo's "Bar"`, `Foo 'Bar' "Baz"` ]).value,
            `Foo's "Bar" Foo 'Bar' "Baz"`
        );
    });

    it("ignores null and undefined", () => {
        assert(shell.preserve(null).value === '');
        assert(shell.preserve(undefined).value === '');
    });

    it("ignores null and undefined array values", () => {
        assert.strictEqual(
            shell.preserve([
                'Foo Bar',
                null,
                undefined,
                'Baz Quux'
            ]).value,
            `Foo Bar Baz Quux`
        );
    });

    it("stringifies defined values", () => {
        assert(shell.preserve('').value === '');
        assert(shell.preserve(false).value === 'false');
        assert(shell.preserve(42).value === '42');
    });

    it("stringifies defined array values", () => {
        assert.strictEqual(
            shell.preserve([
                'Foo Bar',
                0,
                '',
                false,
                'Baz Quux'
            ]).value,
            `Foo Bar 0  false Baz Quux`
        );
    });

    it("flattens nested array values", () => {
        assert.strictEqual(
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
        );
    });

    it("preserves embedded strings", () => {
        let verbatim = shell.preserve('Foo Bar');
        assert(shell`foo ${verbatim}` === "foo Foo Bar");
    });

    it("preserves embedded arrays", () => {
        let verbatim = shell.preserve([ 'Foo Bar', 'Baz Quux' ]);
        assert(shell`foo ${verbatim}` === "foo Foo Bar Baz Quux");
    });

    it("preserves embedded nested strings/arrays", () => {
        let verbatim = shell.preserve([
            '1 2',
            shell.preserve('3 4'),
            shell.preserve([ '5 6', '7 8' ]),
            '9 10'
        ]);

        assert.strictEqual(
            shell`foo ${shell.preserve(verbatim)} bar`,
            "foo 1 2 3 4 5 6 7 8 9 10 bar"
        );
    });

    it('supports embedded escapes', () => {
        let param = shell.preserve(shell.escape('foo bar'), [ "baz's quux" ])

        assert.strictEqual(
            shell `command ${param}`,
            `command 'foo bar' baz's quux`
        );
    });
});
