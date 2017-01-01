'use strict'

const del   = require('del')
const gulp  = require('gulp')
const babel = require('gulp-babel')
const mocha = require('gulp-mocha')

const TARGET_DIR = 'target'

const paths = {
    src:  'src/**/*.js',
    test: 'test/src/**/*.js',
}

for (let [ name, path ] of Object.entries(paths)) {
    gulp.task(`compile:${name}`, () => {
        return gulp
            .src(path, { base: '.' })
            .pipe(babel())
            .pipe(gulp.dest(TARGET_DIR))
    })
}

gulp.task('mocha', () => {
    return gulp.src(`${TARGET_DIR}/${paths.test}`, { read: false })
        .pipe(mocha())
})

gulp.task('clean', () => del(TARGET_DIR))

gulp.task('compile', gulp.parallel('compile:src', 'compile:test'))
gulp.task('test', gulp.series('compile', 'mocha'))
gulp.task('default', gulp.task('test'))
