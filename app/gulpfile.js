var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
  //TODO
  gulp.src('tellme/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('tellme/'));
});

gulp.task('watch', function() {
  gulp.watch(['tellme/sass/*.scss'], ['styles']);
});

gulp.task('default', ['styles', 'watch']);
