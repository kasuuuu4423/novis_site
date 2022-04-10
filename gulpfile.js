const gulp = require("gulp");
const sass =  require('gulp-sass')(require('sass'));
const clean = require("gulp-clean-css");
const rename = require("gulp-rename");
const prefix = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const browserSync = require("browser-sync");
const { dest } = require("gulp");
const pug = require("gulp-pug");
// const sftp = require('gulp-sftp-up4');

const paths = {
  'dest'    : 'dest/',
  'pug'     : 'src/pug/**/!(_)*.pug',
  'html'    : 'dest/',
  'scss'  : 'src/scss/**/*.scss',
  'css'   : 'dest/css/',
  'jsSrc' : 'src/js/**/*.js',
  'jsDest': 'dest/js/',
}

gulp.task("sass", () => {
  return(
    gulp
      .src(paths.scss)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefix(['last 3 versions', 'ie >= 8', 'Android >= 4', 'iOS >= 8']))
      .pipe(rename({extname: '.min.css'}))
      .pipe(clean())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(paths.css))
  );
});

gulp.task("pug", () => {
  return(
    gulp
      .src(paths.pug)
      .pipe(pug({
        pretty: true,
        basedir: paths.pug
      }))
      .pipe(dest(paths.html))
  );
});


gulp.task("js", () => {
  return(
    gulp
      .src(paths.jsSrc)
      .pipe(dest(paths.jsDest))
  )
});

gulp.task("browser-sync", () => {
  return browserSync.init({
    server: {
      basedir: paths.dest
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

gulp.task("reload", (done) => {
  browserSync.reload();
  done();
});

// gulp.task('upload', () => {
//   return (
//     gulp
//       .src('dest/**/*', '!dest/fonts/*')
//       .pipe(sftp({
//           // FTP情報を入力
//           host: "",
//           user: "",
//           pass: "",
//           remotePath: ""
//       }))
//   );
// });

const tasks = ['reload'];//, 'upload'];

gulp.task('watch', (done) => {
  gulp.watch(paths.scss, gulp.series('sass', tasks));
  gulp.watch(paths.pug, gulp.series('pug', tasks));
  gulp.watch(paths.jsSrc, gulp.series('js', tasks));
  done();
});

gulp.task('default',
  gulp.parallel('watch', 'browser-sync')
);
