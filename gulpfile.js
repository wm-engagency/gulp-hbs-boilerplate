// Gulp
const { series, parallel, src, dest, watch } = require('gulp');

// Config
const config = require('./config');

// General
const header = require('gulp-header');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const newer = require('gulp-newer');
const packageDetails = require('./package.json');

// Handlebars
var handlebars = require('gulp-hb');

// Styles
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const purgecss = require('gulp-purgecss');
const cleanCss = require('gulp-clean-css');

// Icons
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

// Scripts
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const babel = require('gulp-babel');

// Error Handling
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// Browser Sync
const browserSync = require('browser-sync').create();

// Remove Existing Build Folder
function clean(done) {
  del.sync([config.paths.output])
  return done()
}

// Compile Handlebars to HTML
function hbs() {
  return src(config.paths.handlebars.input)
    .pipe(handlebars()
      .partials('./src/templates/partials/**/*.hbs')
      .data('./src/templates/data/**/*.{js,json}'))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(config.paths.handlebars.output))
    .pipe(browserSync.stream())
}

// Compile, Lint, Concat, Remove Unused and Minify
function css() {
  return src(config.paths.styles.input)
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'SCSS Error!',
            subtitle: 'See the terminal for more information.',
            message: '<%= error.message %>',
            wait: false,
            templateOptions: {
              date: new Date().toDateString(),
            },
          })(err)
        },
      })
    )
    .pipe(sass({ outputStyle: 'expanded', sourceComments: true }))
    .on('error', sass.logError)
    .pipe(
      prefix({
        cascade: true,
        remove: true,
        grid: 'autoplace',
      })
    )
    .pipe(
      purgecss({
        content: ['src/*.html', 'src/**/*.hbs'],
      })
    )
    .pipe(header(config.banners.full, { packageDetails: packageDetails }))
    .pipe(dest(config.paths.styles.output))
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCss({ level: { 1: { specialComments: 'none' } } }))
    .pipe(header(config.banners.min, { packageDetails: packageDetails }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(config.paths.styles.output))
    .pipe(browserSync.stream())
}

function fonts() {
  return src(config.paths.fonts.input).pipe(dest(config.paths.fonts.output));
}

function icons() {
  var fontName = 'icons';
  return src([config.paths.icons.input])
    .pipe(
      iconfontCss({
        fontName: fontName,
        targetPath: '../scss/base/_icons.scss',
        fontPath: '../fonts/',
      }),
    )
    .pipe(
      iconfont({
        fontName: fontName,
        // Remove woff2 if you get an ext error on compile
        // formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
        formats: ['svg', 'woff2'],
        normalize: true,
        fontHeight: 1001,
      }),
    )
    .pipe(dest(config.paths.icons.output));
}

function js() {
  return src(config.paths.scripts.input)
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'JavaScript Error!',
            subtitle: 'See the terminal for more information.',
            message: '<%= error.message %>',
            onLast: true,
            wait: false,
            templateOptions: {
              date: new Date().toDateString(),
            },
          })(err)
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(header(config.banners.full, { packageDetails: packageDetails }))
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(dest(config.paths.scripts.output))
    .pipe(rename({ suffix: '.min' }))
    .pipe(terser())
    .pipe(header(config.banners.min, { packageDetails: packageDetails }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(config.paths.scripts.output))
    .pipe(browserSync.stream())
}

// Optimize Images
function img() {
  return src(config.paths.images.input)
    .pipe(newer(config.paths.images.output))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(config.paths.images.output))
    .pipe(newer(config.paths.images.output))
    .pipe(webp())
    .pipe(dest(config.paths.images.output))
}

// Copy Video Files
function video() {
  return src(config.paths.video.input).pipe(newer(config.paths.video.output)).pipe(dest(config.paths.video.output))
}

// Initialize Server
function server(done) {
  browserSync.init({
    server: {
      baseDir: config.paths.reload,
    },
  })
  done()
}

// Watch for Changes
function changed() {
  return (
    watch(
      ['src/assets/scss/**/*.scss'],
      series(css, function cssRelaod(done) {
        browserSync.reload()
        done()
      })
    ),
    watch(
      ['src/templates/**/*.*'],
      series(hbs, function hbsRelaod(done) {
        browserSync.reload()
        done()
      })
    ),
    watch(
      ['src/**/*.html'],
      series(hbs, function hbsRelaod(done) {
        browserSync.reload()
        done()
      })
    ),
    watch(
      ['src/assets/scripts/'],
      series(js, function jsRelaod(done) {
        browserSync.reload()
        done()
      })
    ),
    watch(
      ['src/assets/images/'],
      series(img, function imagesRelaod(done) {
        browserSync.reload()
        done()
      })
    )
  )
}

// Remove dist Folder (gulp clean)
exports.clean = series(clean);

// Compile Icons to Iconfont
exports.icons = series(icons);

// Media to be Minified
exports.media = series(img, video);

// Compile, Watch and Reload (gulp watch)
exports.serve = parallel(series(hbs, css, js, fonts), series(img, video), series(server, changed));

// Clean Old Files and Compile Everything - without running a browser (gulp)
exports.default = series(clean, parallel(hbs), parallel(css), parallel(js), parallel(fonts), parallel(img, series(video)));
