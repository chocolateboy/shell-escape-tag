import shell from '..'
import test  from 'ava'

// XXX results assume these tests are running on non-Windows

test('synopsis', t => {
    const filenames = [1, 2].map(it => `Holiday Snaps/Pic ${it}.jpg`)
    const title = 'Holiday Snaps'
    const command = shell`compress --title ${title} ${filenames}`

    t.is(command, "compress --title 'Holiday Snaps' 'Holiday Snaps/Pic 1.jpg' 'Holiday Snaps/Pic 2.jpg'")
})

test('escape', t => {
    const escaped = shell.escape("foo's bar")
    const command1 = `command ${escaped}`
    const command2 = shell`command ${escaped}`

    t.is(command1, `command 'foo'"'"'s bar'`)
    t.is(command2, `command 'foo'"'"'s bar'`)
})

test('preserve', t => {
    const preserved = shell.preserve("baz's quux")
    const command1 = `command "${preserved}"`
    const command2 = shell`command "${preserved}"`

    t.is(command1, `command "baz's quux"`)
    t.is(command2, `command "baz's quux"`)
})
