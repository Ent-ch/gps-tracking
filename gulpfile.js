/* eslint-disable */
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var es6Path = 'ui/*.js';
var compilePath = 'public\scripts';
var superstatic = require( 'superstatic' );

gulp.task('babel', function () {
    gulp.src([es6Path])
        .pipe(babel())
        .pipe(gulp.dest(compilePath));
});

gulp.task('watch', function() {
    gulp.watch(es6Path, ['babel']);
});

gulp.task('serve', ['babel', 'watch'], function() {
  process.stdout.write('Starting browserSync and superstatic...\n');
  browserSync({
    port: 3000,
    files: ['index.html', '**/*.js'],
    injectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    logPrefix: 'es6-modules-starter',
    notify: true,
    reloadDelay: 0,
    server: {
      baseDir: '.',
      middleware: superstatic({ debug: false})
    }
  });
});

gulp.task('default', ['babel', 'watch']);