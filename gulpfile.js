var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function () {
    return gulp.src('wwwroot/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('wwwroot/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('wwwroot/scss/**/*.scss', gulp.series('sass'));
});