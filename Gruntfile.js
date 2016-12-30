'use strict'

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-mocha-test')

    grunt.initConfig({
        babel: {
            src: {
                expand: true,
                src: 'src/**/*.js',
                dest: 'target',
            },
            test: {
                options: {
                    plugins: [ 'babel-plugin-espower' ],
                },
                expand: true,
                src: 'test/src/**/*.js',
                dest: 'target',
            }
        },
        clean: [ 'target' ],
        mochaTest: {
            src: 'target/test/src/**/*.js'
        }
    })

    grunt.registerTask('compile:src', [ 'babel:src' ])
    grunt.registerTask('compile:test', [ 'babel:test' ])
    grunt.registerTask('compile', [ 'compile:src', 'compile:test' ])
    grunt.registerTask('test', [ 'compile', 'mochaTest' ])
    grunt.registerTask('default', [ 'test' ])
}
