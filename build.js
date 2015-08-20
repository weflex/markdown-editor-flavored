
const es = require('event-stream');
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-minify-css');
const DEST_PATH = './dist';

gulp.task(
  'build-js',
  function () {
    gulp.src([
      'lib/*.js',
      'node_modules/markdown-it/dist/markdown-it.min.js'
    ])
    .pipe(concat('markdown-editor.js'))
    .pipe(uglify())
    .pipe(
      es.map(function (file, callback) {
        file.contents = new Buffer(
          '(function (window) {' +
            file.contents +
            'window.MarkdownEditor = MarkdownEditor;'+
          '})(window);'
        );
        callback(null, file);
      })
    )
    .pipe(gulp.dest(DEST_PATH));
  }
);

gulp.task(
  'build-css',
  function () {
    gulp.src([
      'lib/*.css'
    ])
    .pipe(concat('markdown-editor.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(DEST_PATH));
  }
);

gulp.task(
  'build',
  [
    'build-js',
    'build-css'
  ]
);
