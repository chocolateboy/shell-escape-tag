const test = require('ava')

test('require works without .default', t => {
    const shell = require('..')
    const files = ['foo bar.gif', 'baz quux.png']
    t.is(shell`compress ${files}`, "compress 'foo bar.gif' 'baz quux.png'")
})
