import test from 'ava'

test('require with .default', t => {
    const shell = require('../dist/shell-escape-tag').default
    const files = ['foo bar.gif', 'baz quux.png']
    t.true(shell`compress ${files}` === "compress 'foo bar.gif' 'baz quux.png'")
})

test('require without .default', t => {
    const shell = require('../dist/shell-escape-tag')
    const files = ['foo bar.gif', 'baz quux.png']
    t.true(shell`compress ${files}` === "compress 'foo bar.gif' 'baz quux.png'")
})
