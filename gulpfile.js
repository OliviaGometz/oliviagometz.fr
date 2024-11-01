const gulp = require("gulp"),
  sass = require("gulp-dart-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  nunjucksRender = require("gulp-nunjucks-render"),
  data = require("gulp-data");

const paths = {
  styles: {
    src: "sass/**/*.scss",
    dest: "css",
  },
  njk: {
    src: "app/**/**/*",
    dest: ".",
  },
};

const frenchMonths = {
  "01": "janvier",
  "02": "février",
  "03": "mars",
  "04": "avril",
  "05": "mai",
  "06": "juin",
  "07": "juillet",
  "08": "août",
  "09": "septembre",
  "10": "octobre",
  "11": "novembre",
  "12": "décembre"
};

function dateFormat(input, returnMonth = true, returnYear = true) {
  var date = input.split('-');
  var day = date[2] ? date[2] + ' ' : '';
  var month = returnMonth ? frenchMonths[date[1]] : '';
  var year = returnYear ? ' ' + date[0] : '';

  return day + month + year;
}

function isSameMonth(input1, input2) {
  var month1 = input1.split('-')[1];
  var month2 = input2.split('-')[1];

  return month1 == month2;
}

function datesToString(input) {
  var formattedDate = '';

  if (input.start != input.end) {
    formattedDate = 'Du ' + dateFormat(input.start, !isSameMonth(input.start, input.end), false) + ' au ' + dateFormat(input.end);
  } else {
    formattedDate = 'Le ' + dateFormat(input.start);
  }

  return formattedDate;
}

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.styles.dest));
}

function html() {
  return gulp
    .src("app/pages/**/*.njk")
    .pipe(
      data(function () {
        const books = require("./app/content/books.json");
        const events = require("./app/content/events.json");
        const linktree = require("./app/content/linktree.json");
        const logos = require("./app/content/logos.json");
        const places = require("./app/content/places.json");
        const podcasts = require("./app/content/podcasts.json");
        const timeline = require("./app/content/timeline.json");
        const websites = require("./app/content/websites.json");
        return { books, events, linktree, logos, places, podcasts, timeline, websites };
      })
    )
    .pipe(
      nunjucksRender({
        path: ["app/templates"],
        manageEnv: function (nunjucksEnv) {
          nunjucksEnv.addFilter("dateFormat", dateFormat);
          nunjucksEnv.addFilter("datesToString", datesToString);
        },
      })
    )
    .pipe(gulp.dest(paths.njk.dest));
}

function watch() {
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.njk.src, html);
}

exports.watch = watch;
