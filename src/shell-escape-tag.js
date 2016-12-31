import 'source-map-support/register'
import shellEscape from 'any-shell-escape'
import flattenDeep from 'lodash.flattendeep'
import zip         from 'lodash.zip'

/*
 * wrapper class for already escaped/preserved values.
 * the `shell` function extracts the escaped/preserved value
 * from instances of this class rather than escaping them again
 */
class Escaped {
    constructor (value) {
        this.value = value
    }

    toString () {
        return this.value
    }

    // for console.log &c.
    inspect () {
        return this.toString()
    }
}

/*
 * performs the following mappings on the supplied value(s):
 *
 * - already-escaped/preserved values are passed through verbatim
 * - null and undefined are ignored (i.e. mapped to empty arrays,
 *   which are pruned by flatten)
 * - non-strings are stringified e.g. false -> "false"
 *
 * then flattens the resulting array and returns its elements joined by a space
 */
function _shellEscape (params, options = {}) {
    let escaped = [ __shellEscape(params, options) ]
    let flattened = flattenDeep(escaped)
    return flattened.join(' ')
}

/*
 * the (recursive) guts of _shellEscape. returns a leaf node (string)
 * or a possibly-empty array of arrays/leaf nodes. prunes
 * null and undefined by returning empty arrays
 */
function __shellEscape (params, options) {
    if (params instanceof Escaped) {
        return params.value
    } else if (Array.isArray(params)) {
        return params.map(param => __shellEscape(param, options))
    } else if (params == null) {
        return []
    } else {
        return options.verbatim ? String(params) : shellEscape(String(params))
    }
}

/*
 * escapes embedded string/array template parameters and passes
 * through already escaped/preserved parameters verbatim
 */
export default function shell (strings, ...params) {
    let result = ''

    for (let [ string, param ] of zip(strings, params)) {
        result += string + _shellEscape(param)
    }

    return result
}

/*
 * helper method which escapes embedded/nested strings/arrays and
 * prevents them being escaped again
 */
shell.escape = function escape (...params) {
    return new Escaped(_shellEscape(params, { verbatim: false }))
}

/*
 * helper method which protects its parameters from being escaped
 */
shell.preserve = function verbatim (...params) {
    return new Escaped(_shellEscape(params, { verbatim: true }))
}

shell.protect = shell.verbatim = shell.preserve
