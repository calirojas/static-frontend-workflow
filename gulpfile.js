/*
 *
 */

var gulp 			= require('gulp'),
	concat			= require('gulp-concat'),
	uglify			= require('gulp-uglify'),
	pug				= require('gulp-pug'),
	server			= require('gulp-server-livereload'),
	rename			= require('gulp-rename'),
	sass			= require('gulp-sass'),
	watch			= require('gulp-watch'),
	plumber			= require('gulp-plumber'),
	autoprefixer	= require('gulp-autoprefixer'),
	fs				= require('fs'),
	cssimport		= require('gulp-cssimport'),
	_bundle 		= {file: './bundle.json', content: ''};

	_bundle.content = JSON.parse(fs.readFileSync(_bundle.file))

gulp.task('scripts', function(){
	gulp.src(_bundle.content.files.scripts)
		.pipe(concat('scripts.js'))
		.pipe(rename(_bundle.content.paths.dist.scripts.file))
		.pipe(uglify())
		.pipe(gulp.dest(_bundle.content.paths.dist.folder + _bundle.content.paths.dist.scripts.folder));
});

gulp.task('styles', function(){
	gulp.src(_bundle.content.files.styles)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssimport())
		.pipe(rename(_bundle.content.paths.dist.styles.file))
		.pipe(gulp.dest(_bundle.content.paths.dist.folder + _bundle.content.paths.dist.styles.folder));
});

gulp.task('markup', function(){
	gulp.src(_bundle.content.files.markup.pages)
		.pipe(plumber())
		.pipe(pug({
			pretty: false,
			basedir: _bundle.content.paths.dist.markup.baseDir
		}))
		.pipe(gulp.dest(_bundle.content.paths.dist.folder + _bundle.content.paths.dist.markup.folder));
});

gulp.task('webserver', function(){
	gulp.src(_bundle.content.paths.dist.server)
		.pipe(server({
			livereload: true,
			directoryListing: false,
			open: true
		}));
});

gulp.task('load-bundle', function(){
	_bundle.content = JSON.parse(fs.readFileSync(_bundle.file));
});

gulp.task('watch', function(){
	gulp.watch('bundle.json', ['build']);
	gulp.watch(['src/scss/**/*.scss', 'src/components/**/*.scss'], ['styles']);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch(['src/*.pug', 'src/pug/**/*.pug'], ['markup']);
});

gulp.task('dev', ['watch', 'webserver']);
gulp.task('build', ['load-bundle', 'scripts', 'styles', 'markup']);
