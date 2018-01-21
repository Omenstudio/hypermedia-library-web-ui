var gulp           = require('gulp'),
	gutil          = require('gulp-util' ),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	cleanCSS       = require('gulp-clean-css'),
	rename         = require('gulp-rename'),
	del            = require('del'),
	imagemin       = require('gulp-imagemin'),
	autoprefixer   = require('gulp-autoprefixer'),
	notify         = require("gulp-notify"),
    flatten        = require('gulp-flatten');

// Пользовательские скрипты проекта

gulp.task('libs-js', function() {
    return gulp.src([
        'libs/**/*.js'
    ])
    .pipe(flatten())
    .pipe(gulp.dest('../js'));
});

gulp.task('libs-css', function() {
    return gulp.src([
        'libs/**/*.css'
    ])
    .pipe(flatten())
    .pipe(gulp.dest('../css'));
});

gulp.task('libs', ['libs-js', 'libs-css'], function() {});


gulp.task('js', function() {
	return gulp.src([
		'js/**/*.js'
		])
	.pipe(concat('app.min.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('../js'));
});

gulp.task('sass', function() {
	return gulp.src('sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	//.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('../css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        //server: {
        //	baseDir: '../'
        //},
        proxy: 'hydraui',
        notify: false
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('sass/**/*.sass', ['sass']);
	gulp.watch('js/**/*.js', ['js']);
	gulp.watch('../*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin())) // Cache Images
	.pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['libs', 'watch']);
