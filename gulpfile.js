var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();


gulp.task('default', ['compile'], function() {

	// serve
	browserSync.init({
		server: {
		    baseDir: './'
		},
		notify: false
	});

	// watch
	gulp.watch('skimmer.js', ['compile']);
	gulp.watch(['index.html', 'skimmer.min.js'], browserSync.reload);
});

gulp.task('compile', function() {
	return gulp.src('skimmer.js')
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(rename('skimmer.min.js'))
		.pipe(gulp.dest(''));
});