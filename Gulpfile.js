var nodemon = require("gulp-nodemon"),
  gulp = require("gulp"),
  ts = require("gulp-typescript"),
  conventionalChangelog = require('gulp-conventional-changelog'),
  file = require("gulp-file"),
  path = require('path'),
  tsProject = ts.createProject("tsconfig.json");

var paths = {
  src: "./src",
  bin: "./bin"
}

gulp.task("typescript", () => {
  return gulp.src("./src/**/*.ts")
    .pipe(tsProject())
    .js.pipe(gulp.dest(paths.bin));
});

gulp.task('watch', ['typescript'], () => {
  nodemon({
    script: path.join(paths.bin, 'main.js'),
    ext: 'ts js',
    watch: [paths.src],
    tasks: (changedFiles) => {
      var tasks = []
      changedFiles.forEach((file) => {
        // add typescript compilation if a *-ts file was changed
        if (path.extname(file) === '.ts' && !~tasks.indexOf('typescript')) tasks.push('typescript')
      })
      return tasks
    },
    env: {
      'NODE_ENV': 'development'
    }
  })
});

gulp.task('changelog', function () {
  return file("CHANGELOG.md", "", { src: true })
  .pipe(conventionalChangelog({
    preset: 'angular',
    releaseCount: 0
  }, {}, {}, {
    headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\:? (.*)$/m
  }))
  .pipe(gulp.dest("./")); // or any writable stream
});

gulp.task("build", ["typescript"], () => {
  return;
});

gulp.task("default", ["build"], () => {
  return;
});