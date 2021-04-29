import autoprefixer from "gulp-autoprefixer";
const browsersync = require("browser-sync").create();
import cleanCSS from "gulp-clean-css";
import del from "del";
import { src, dest, watch as __watch, series, parallel } from "gulp";
import header from "gulp-header";
import merge from "merge-stream";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sass, { logError } from "gulp-sass";

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

function modules() {
  var bootstrap = src("./node_modules/bootstrap/dist/**/*").pipe(
    dest("./vendor/bootstrap")
  );

  var jquery = src([
    "./node_modules/jquery/dist/*",
    "!./node_modules/jquery/dist/core.js"
  ]).pipe(dest("./vendor/jquery"));
  return merge(bootstrap, jquery);
}

function css() {
  return src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: "./node_modules"
      })
    )
    .on("error", logError)
    .pipe(
      autoprefixer({
        cascade: false
      })
    )

    .pipe(dest("./css"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(cleanCSS())
    .pipe(dest("./css"))
    .pipe(browsersync.stream());
}

function watchFiles() {
  __watch("./scss/**/*", css);
  __watch("./**/*.html", browserSyncReload);
}

const vendor = series(clean, modules);
const build = series(vendor, css);
const watch = series(build, parallel(watchFiles, browserSync));

const _css = css;
export { _css as css };
const _clean = clean;
export { _clean as clean };
const _vendor = vendor;
export { _vendor as vendor };
const _build = build;
export { _build as build };
const _watch = watch;
export { _watch as watch };
const _default = build;
export { _default as default };
