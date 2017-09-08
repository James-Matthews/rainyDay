var gulp        = require('gulp');
var bs          = require('browser-sync').create();   

gulp.task('serve', [], () => {
        bs.init({
            server: {
               baseDir: "./",
            },
            port: 8000,
            reloadOnRestart: true,
            browser: "google chrome"
        });
        gulp.watch('./**/*', ['', bs.reload]);
});