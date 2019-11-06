// eslint eslint-disable-file no-use-before-define

// - PROJECT --------------------------------------------------------------------
const fs = require('fs');

const project = JSON.parse(fs.readFileSync('./package.json'));

// - IMPORTS --------------------------------------------------------------------
const { src, dest, series, parallel, watch } = require('gulp');

const del = require('del');
const gulpPug = require('gulp-pug');
const gulpSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const gulpCache = require('gulp-cache');
const previewBS = require('browser-sync').create('preview');
const buildBS = require('browser-sync').create('build');

// - BROWSER-SYNC SETTING -------------------------------------------------------
const previewSettingsBS = {
  proxy: '',
  baseDir: 'preview/',
  port: 8000,
  UIport: 8001,
};
const buildSettingsBS = {
  proxy: '',
  baseDir: 'build/',
  port: 9000,
  UIport: 9001,
};

// - VARIABLES ------------------------------------------------------------------
const look = {
  php: 'src/**/*.php',
  html: 'src/**/*.html',
  pug: 'src/**/*.pug',
  js: 'src/js/**/*.js',
  sass: ['src/**/*.sass', 'src/**/*.scss'],
  css: 'src/**/*.css',
};
const take = {
  all: 'src/**/*.*',
  php: 'src/**/*.php',
  html: 'src/**/*.html',
  pug: 'src/**/*.pug',
  js: 'src/js/**/*.js',
  sass: 'src/sass/**/*.sass',
  css: 'src/css/**/*.css',
  img: 'src/img/**/*.*',
  stuff: [
    'src/**/*.*',
    '!src/sass/**',
    '!src/components/**',
    '!src/sections/**',
    '!src/img/**',
    '!src/js/**',
    '!src/*.html',
    '!src/*.pug',
    '!src/*.jpg',
    'src/*.ico',
  ],
};
const put = {
  all: 'preview/',
  php: 'preview/',
  html: 'preview/',
  pug: 'preview/',
  css: 'preview/css/',
  js: 'preview/js/',
  img: 'preview/img/',
  stuff: 'preview/',
};
const build = {
  all: 'build/',
  php: 'build/',
  html: 'build/',
  pug: 'build/',
  css: 'build/css/',
  js: 'build/js/',
  img: 'build/img/',
  stuff: 'build/',
};
const except = {
  src: {
    templates: ['!src/components', '!src/components/**/*', '!src/sections', '!src/sections/**/*'],
    sass: '!src/sass/**/*',
    pug: '!src/*.pug',
  },
  preview: {
    img: [
      '!preview/img',
      '!preview/img/**/*',
      '!preview/*.jpg',
      '!preview/*.png',
      '!preview/*.ico',
    ],
    fonts: ['!preview/fonts', '!preview/fonts/**/*'],
    stuff: ['!preview/lib/', '!preview/lib/**/*'],
  },
};
const delDir = {
  preview: 'preview/**',
  build: 'build/**',
};

// - PREVIEW --------------------------------------------------------------------
const BSpreview = () => {
  if (previewSettingsBS.proxy) {
    previewBS.init({
      proxy: previewSettingsBS.proxy,
      watchOptions: {
        ignored: 'node_modules/*',
        ignoreInitial: true,
      },
      tunnel: true,
      notify: false,
      port: previewSettingsBS.port,
      ui: {
        port: previewSettingsBS.UIport,
      },
      logPrefix: `${project.name} | ${project.version} | preview`,
    });
  } else {
    previewBS.init({
      server: {
        baseDir: previewSettingsBS.baseDir,
      },
      notify: false,
      port: previewSettingsBS.port,
      ui: {
        port: previewSettingsBS.UIport,
      },
      logPrefix: `${project.name} | ${project.version} | preview`,
    });
  }
};

const php = () => {
  return src(take.php)
    .pipe(dest(put.php))
    .pipe(previewBS.stream());
};

const html = () => {
  return src(take.html)
    .pipe(dest(put.html))
    .pipe(previewBS.stream());
};

const pug = () => {
  return src([take.pug, ...except.src.templates])
    .pipe(
      gulpPug({
        pretty: '  ',
        basedir: 'src/',
      })
    )
    .pipe(dest(put.pug))
    .pipe(previewBS.stream());
};

const sass = () => {
  return src(take.sass)
    .pipe(sourcemaps.init())
    .pipe(gulpSass({ indentType: 'tab', indentWidth: 1 }).on('error', gulpSass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(dest(put.css))
    .pipe(previewBS.stream());
};

const js = () => {
  return src(take.js)
    .pipe(dest(put.js))
    .pipe(previewBS.stream());
};

const img = () => {
  return src(take.img).pipe(dest(put.img));
};

const stuff = () => {
  return src(take.stuff).pipe(dest(put.stuff));
};

const delPreview = () => {
  return del([delDir.preview], { force: true });
};

watch(look.pug, pug);
watch(look.html, html);
watch(look.php, php);
watch(look.sass, sass);
watch(look.js, js);

// - BUILD ----------------------------------------------------------------------

const BSbuild = () => {
  if (buildSettingsBS.proxy) {
    buildBS.init({
      proxy: buildSettingsBS.proxy,
      watchOptions: {
        ignored: 'node_modules/*',
        ignoreInitial: true,
      },
      tunnel: true,
      notify: false,
      port: buildSettingsBS.port,
      ui: {
        port: buildSettingsBS.UIport,
      },
      logPrefix: `${project.name} | ${project.version} | build`,
    });
  } else {
    buildBS.init({
      server: {
        baseDir: buildSettingsBS.baseDir,
      },
      notify: false,
      port: buildSettingsBS.port,
      ui: {
        port: buildSettingsBS.UIport,
      },
      logPrefix: `${project.name} | ${project.version} | build`,
    });
  }
};

const phpBuild = () => {
  return src(take.php)
    .pipe(dest(build.php))
    .pipe(buildBS.stream());
};

const htmlBuild = () => {
  return src(take.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(build.html))
    .pipe(buildBS.stream());
};

const pugBuild = () => {
  return src([take.pug, ...except.src.templates])
    .pipe(
      gulpPug({
        basedir: 'src/',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(build.pug))
    .pipe(buildBS.stream());
};

const sassBuild = () => {
  return src(take.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(cssnano())
    .pipe(dest(build.css));
};

const jsBuild = () => {
  return src(take.js)
    .pipe(uglify())
    .pipe(dest(build.js))
    .pipe(buildBS.stream());
};

const stuffBuild = () => {
  return src(take.stuff).pipe(dest(build.stuff));
};

const delBuild = () => {
  return del.sync([delDir.build]);
};

const imgBuild = () => {
  return src(take.img)
    .pipe(
      gulpCache(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
          interlaced: true,
        })
      )
    )
    .pipe(dest(build.img));
};

// const watch_build = () => {
//     watch(look.pug, pug_build);
//     watch(look.html, html_build);
//     watch(look.php, php_build);
//     watch(look.sss, sss_build);
//     watch(look.js, js_build);
// };

// - DEV ------------------------------------------------------------------------
const previewProject = series(
  delPreview,
  parallel(php, html, pug, sass, js, img, stuff),
  BSpreview
);

const buildProject = series(
  delBuild,
  parallel(phpBuild, htmlBuild, pugBuild, sassBuild, jsBuild, imgBuild, stuffBuild),
  BSbuild
);

exports.default = series(previewProject);
exports.preview = series(previewProject);
exports.build = series(buildProject);
exports.pug = series(pug);
exports.pugBuild = series(pugBuild);
exports.sass = series(sass);
exports.sassBuild = series(sassBuild);
