var gulp = require('gulp');
var copy = require('gulp-copy');

gulp.task('copy', function(){
    return gulp.src(['./src/**/*.html','./src/**/*.png'])
        .pipe(copy('./dist',{
            prefix:1 //只保留一层原始路径
        }));
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.html', ["copy"]);
});

gulp.task('default', ['copy', 'watch']);