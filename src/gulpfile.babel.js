const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    babelify = require('babelify')
    source = require('vinyl-source-stream'),
    express = require('express'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    minimist = require('minimist'),
    minifyCSS = require('gulp-minify-css'),
    buffer = require('gulp-buffer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jsxhint = require('jsxhint'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer')
;

var server;
var options = minimist(process.argv);
var environment = options.environment || 'development';


gulp.task('html', ()=>{
    return gulp.src('*.html')
    .pipe(gulp.dest('../dist'))
    .pipe(reload());
});

gulp.task('sass', ()=>{
    return gulp.src('_css/**/*.scss')
        .pipe(environment === 'development' ? sourcemaps.init() : gutil.noop())
        .pipe(sass()).on('error', handleError)
        .pipe(postcss([ autoprefixer() ]))
        .pipe(environment === 'development' ? sourcemaps.write() : gutil.noop())
        .pipe(environment === 'production' ? minifyCSS() : gutil.noop())
        .pipe(gulp.dest('../dist/_css'))
        .pipe(reload());
});

gulp.task('js-lint', ()=>{
    return gulp.src('_js/**/*.{js,jsx}')
        .pipe(jshint({linter: require('jshint-jsx').JSXHINT }))
        .pipe(jshint.reporter(stylish));
});

gulp.task('js', ()=>{
    return browserify('_js/main.js', {
            debug: environment === 'development'
        })
        .transform(babelify,{presets: ['react']}).on('error', handleError)
        .bundle().on('error', handleError)
        .pipe(environment === 'production' ? buffer() : gutil.noop())
        .pipe(environment === 'production' ? uglify() : gutil.noop())
        .pipe(source('scripts.js'))
        .pipe(gulp.dest('../dist/_js'))
        .pipe(reload());
});

gulp.task('watch', ()=>{
    gulp.watch('index.html', ['html']);
    gulp.watch('_css/*.scss', ['sass']);
    gulp.watch('_js/*.{js,jsx}', ['js']);
});

gulp.task('server', ()=>{
    server = express();
    server.use(express.static('../dist'));
    server.listen(8000);
    browserSync.init({proxy: 'localhost:8000', browser: 'google chrome'});
});

gulp.task('build', ['html','sass','js-lint','js']);

gulp.task('default', ['build','watch','server']);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

function reload() {
    return (server)
        ? browserSync.reload({ stream: true })
        : gutil.noop();
}
