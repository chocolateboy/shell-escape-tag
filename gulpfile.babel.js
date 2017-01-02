import del   from 'del'
import gulp  from 'gulp'
import babel from 'gulp-babel'
import since from 'gulp-changed'
import mocha from 'gulp-mocha'

const DEST = 'target'

const SRC = {
    src:  'src/**/*.js',
    test: 'test/src/**/*.js',
}

for (let [ name, path ] of Object.entries(SRC)) {
    gulp.task(`compile:${name}`, () => {
        return gulp
            .src(path, { base: '.' })
            .pipe(since(DEST))
            .pipe(babel())
            .pipe(gulp.dest(DEST))
    })
}

gulp.task('mocha', () => {
    return gulp.src(`${DEST}/${SRC.test}`, { read: false })
        .pipe(mocha())
})

gulp.task('clean', () => del(DEST))

gulp.task('compile', gulp.parallel('compile:src', 'compile:test'))
gulp.task('test', gulp.series('compile', 'mocha'))
gulp.task('default', gulp.task('test'))
