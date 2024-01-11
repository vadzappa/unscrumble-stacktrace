const gulp = require('gulp');
const browserify = require('browserify');
const concat = require('gulp-concat');
const production = require('gulp-environments').production;
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const source = require('vinyl-source-stream');

const distFolder = function () {
	return production() ? './build/' : './dist/';
};

const cleanTask = function () {
	return gulp.src(distFolder() + '**/*', { read: false })
		.pipe(clean());
};

const copyTask = function () {
	return gulp.src(['./chrome-extension/**', '!./chrome-extension/scss{,/**}'])
		.pipe(gulp.dest(distFolder()));
};

const copyPemTask = function () {
	return gulp.src(['./*.pem'])
		.pipe(gulp.dest(distFolder()));
};

const scriptForegroundTask = function () {
	return browserify('./lib/extension/main')
		.bundle()
		.pipe(source('unscrambler.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(distFolder() + 'js'));
};

const scriptBackgroundTask = function () {
	return browserify('./lib/extension/background')
		.bundle()
		.pipe(source('context.js'))
		.pipe(buffer())
		.pipe(production(uglify()))
		.pipe(gulp.dest(distFolder() + 'js'));
};

const stylesTask = function () {
	return gulp.src('./chrome-extension/css/**/*.css')
		.pipe(concat('main.css'))
		.pipe(gulp.dest(distFolder() + 'css'));
};

const zipManifestTask = function () {
	const manifest = require('./chrome-extension/manifest');
	const distFileName = manifest.name + ' v' + manifest.version + '.zip';

	return gulp.src([distFolder() + '/**/*'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest(distFolder()));
};

const zipTask = gulp.series(cleanTask, copyTask, copyPemTask, scriptForegroundTask, scriptBackgroundTask, stylesTask, zipManifestTask);

gulp.task('copy', copyTask);
gulp.task('clean', cleanTask);
gulp.task('copy:pem', copyPemTask);
gulp.task('script:foreground', scriptForegroundTask);
gulp.task('script:background', scriptBackgroundTask);
gulp.task('sass', stylesTask);
gulp.task('build', gulp.series(cleanTask, copyTask, scriptForegroundTask, scriptBackgroundTask, stylesTask));
gulp.task('zip', zipTask);
gulp.task('chrome-extension', gulp.series(cleanTask, zipTask));