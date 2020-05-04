// plugins for development
const gulp = require('gulp');
const rimraf = require('rimraf');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const dirSync = require('gulp-directory-sync');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const gutil = require('gulp-util');
const webp = require('gulp-webp');
const autoprefixer = require('autoprefixer');
const terser = require('gulp-terser');

// plugins for build
const cssnano = require("cssnano");

const assetsDir = 'assets/';
const outputDir = 'dist/';
const buildDir = 'build/';

//----------------------------------------------------Compiling
gulp.task('jade', function () {
	return gulp.src([assetsDir + 'jade/*.jade', '!' + assetsDir + 'jade/_*.jade'])
		.pipe(plumber())
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest(outputDir))
		.pipe(browserSync.stream());

});

gulp.task('sass', () => {
	return gulp.src([assetsDir + 'sass/**/*.scss', '!' + assetsDir + 'sass/**/_*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(outputDir + 'styles/'))
		.pipe(browserSync.stream());
});

gulp.task('jsConcat', function () {
	return gulp.src(assetsDir + 'js/all/**/*.js')
		.pipe(concat('all.js', { newLine: ';' }))
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(browserSync.stream());
});

//----------------------------------------------------Compiling###

//-------------------------------------------------Synchronization
gulp.task('imageSync', function () {
	return gulp.src(assetsDir + 'i/**/*.{png,jpg,jpeg,svg}')
		.pipe(plumber())
		.pipe(gulp.dest(outputDir + 'i/'))
		.pipe(browserSync.stream());
});

gulp.task("webp", function () {
	return gulp.src(assetsDir + "i/**/*.{png,jpg,jpeg}")
		.pipe(webp())
		.pipe(gulp.dest(outputDir + 'i/'))
		.pipe(browserSync.stream());
});

gulp.task('fontsSync', function () {
	return gulp.src(assetsDir + 'fonts/')
		.pipe(plumber())
		.pipe(dirSync(assetsDir + 'fonts/', outputDir + 'fonts/', { printSummary: true }))
		.pipe(browserSync.stream());
});

gulp.task('jsSync', function () {
	return gulp.src(assetsDir + 'js/*.js')
		.pipe(plumber())
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(browserSync.stream());
});

//-------------------------------------------------Synchronization###


//watching files and run tasks
gulp.task('watchFiles', function () {
	gulp.watch(assetsDir + 'jade/**/*.jade', gulp.series('jade'));
	gulp.watch((assetsDir + 'sass/**/*.scss'), gulp.series('sass'));
	gulp.watch(assetsDir + 'js/**/*.js', gulp.series('jsSync'));
	gulp.watch(assetsDir + 'js/all/**/*.js', gulp.series('jsConcat'));
	gulp.watch(assetsDir + 'fonts/**/*', gulp.series('fontsSync'));
	gulp.watch(assetsDir + "i/**/*", gulp.series('imageSync'));
});

//livereload and open project in browser
gulp.task('browser-sync', function () {
	browserSync.init({
		port: 1338,
		server: {
			baseDir: outputDir
		}
	});
});

//---------------------------------building final project folder
//clean build folder
gulp.task('cleanBuildDir', function (cb) {
	rimraf(buildDir, cb);
});

//minify images
gulp.task('imgBuild', function () {
	return gulp.src(outputDir + 'i/**/*')
		.pipe(gulp.dest(buildDir + 'i/'))
});

//copy fonts
gulp.task('fontsBuild', function () {
	return gulp.src(outputDir + 'fonts/**/*')
		.pipe(gulp.dest(buildDir + 'fonts/'))
});

//copy html
gulp.task('htmlBuild', function () {
	return gulp.src(outputDir + '**/*.html')
		.pipe(gulp.dest(buildDir))
});

// minify js
gulp.task('jsBuild', function () {
	return gulp.src([outputDir + 'js/**/*', '!' + outputDir + 'js/**/fotorama.js'])
		.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(terser())
		.pipe(gulp.dest(buildDir + 'js/'))
});

//copy Fotorama js
gulp.task('jsFotoramaBuild', function () {
	return gulp.src(outputDir + 'js/**/fotorama.js')
		.pipe(gulp.dest(buildDir + 'js/'))
});

//copy, minify css
gulp.task('cssBuild', function () {
	return gulp.src(outputDir + 'styles/**/*.css')
		.pipe(postcss([cssnano()]))
		.pipe(gulp.dest(buildDir + 'styles/'))
});


//--------------------------------------------If you need svg sprite
var svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

gulp.task('svgSpriteBuild', function () {
	return gulp.src(assetsDir + 'i/icons/*.svg')
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill and style declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				defs: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest: '../../../sass/_sprite.scss',
							template: assetsDir + "sass/templates/_sprite_template.scss"
						}
					},
					example: true
				}
			}
		}))
		.pipe(gulp.dest(assetsDir + 'i/sprite/'))
		.pipe(gulp.dest(outputDir + 'i/sprite/'));
});

gulp.task('svgMulticolorSpriteBuild', function () {
	return gulp.src(assetsDir + 'i/multicolor-icons/*.svg')
		// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../multicolor-sprite.svg",
					render: {
						scss: {
							dest: '../../../sass/_multicolor-sprite.scss',
							template: assetsDir + "sass/templates/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(outputDir + 'i/multicolor-sprite/'));
});


gulp.task('watch', gulp.parallel('watchFiles', 'browser-sync', 'imageSync'));

gulp.task('default', gulp.series('jade', 'sass', 'fontsSync', 'jsConcat', 'jsSync', 'watch', 'imageSync'));

gulp.task('build', gulp.series('cleanBuildDir', 'imgBuild', 'fontsBuild', 'htmlBuild', 'jsBuild', 'jsFotoramaBuild', 'cssBuild'));