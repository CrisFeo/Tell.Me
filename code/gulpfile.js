var gulp = require('gulp');
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('source', function() {
  gulp.src('js/main.js')
    .pipe(browserify())
    .pipe(gulp.dest('build'))
    .pipe(reload({ stream:true }));
});

gulp.task('styles', function() {
  //TODO
  gulp.src('styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('build'))
    .pipe(reload({ stream:true }));
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });

  gulp.watch(['*.html'], reload);
  gulp.watch(['styles/**/*.scss'], ['styles']);
  gulp.watch(['js/**/*.js'], ['source']);
});

gulp.task('default', ['source', 'styles', 'serve']);
