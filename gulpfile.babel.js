import rm    from 'del'
import gulp  from 'gulp'
import babel from 'gulp-babel'
import since from 'gulp-changed'
import mocha from 'gulp-mocha'

const SRC = { src: 'src/**/*.js', test: 'test/src/**/*.js' }
const DEST = 'target'
const COMPILE_TASKS = []

function runMocha () {
    return gulp.src(`${DEST}/${SRC.test}`, { read: false })
        .pipe(mocha())
}

for (let [ name, path ] of Object.entries(SRC)) {
    let task = `compile:${name}`

    COMPILE_TASKS.push(task)

    gulp.task(task, () => {
        return gulp
            .src(path, { base: '.' })
            .pipe(since(DEST))
            .pipe(babel())
            .pipe(gulp.dest(DEST))
    })
}

gulp.task('clean', () => rm(DEST))
gulp.task('compile', gulp.parallel(...COMPILE_TASKS))
gulp.task('test', gulp.series('compile', runMocha))
gulp.task('default', gulp.task('test'))
