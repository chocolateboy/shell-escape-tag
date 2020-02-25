const test  = require('ava')
const shell = require('..')

// from https://github.com/chocolateboy/shell-escape-tag/issues/12

test('grep', t => {
    const pattern = ''
    const command = shell`echo 'hello' | grep ${pattern}`

    t.is(command, "echo 'hello' | grep ''")
})

test('shell', t => {
    const emptyString = ''
    const emptyStrings = ['foo', '', 'bar', '', 'baz']
    const command = shell`command --test ${emptyString} ${emptyStrings}`

    t.is(command, "command --test '' foo '' bar '' baz")
})

test('escape', t => {
    const emptyString = shell.escape('')
    const emptyStrings = shell.escape(['foo', '', 'bar', '', 'baz'])
    const command = shell`command --test ${emptyString} ${emptyStrings}`

    t.is(command, "command --test '' foo '' bar '' baz")
})

test('preserve', t => {
    const emptyString = shell.preserve('')
    const emptyStrings = shell.preserve(['foo', '', 'bar', '', 'baz'])
    const command = shell`command --test ${emptyString} ${emptyStrings}`

    t.is(command, 'command --test  foo  bar  baz')
})
