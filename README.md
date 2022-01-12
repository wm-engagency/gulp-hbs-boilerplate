# Gulp 4 / Handlebars boilerplate [![Build Status](https://travis-ci.com/jonwelsh/gulp-hbs-boilerplate.svg?token=69ckJa4VXSaQchDQg4bW&branch=master)](https://travis-ci.com/jonwelsh/gulp-handlebars)

A boilerplate for building projects using Gulp 4, Handlebars & SCSS.

**Features**

- Build HTML files using Handlebars templates.
- Select which JavaScript files to concatenate and include them in a single file.
- Minify JavaScript files.
- Linting with JSHint.
- Uses 7-1 Sass architecture folder structure. [7-1 Guidelines](https://sass-guidelin.es/#the-7-1-pattern)
- Compile, minify, autoprefix and lint Sass/SCSS.
- Strip out any unused styles from CSS files.
- Identify scripts and styles with project details (see `config.js -> banners`).
- Creates sourcemaps for both minified scripts and styles.
- Reduce JPG file sizes and make a WebP copy.
- Optimise SVGs.
- Watch for file changes and automatically recompile.
- Reload webpages.


## Getting started

Make sure have the following installed:

[Node.js](https://nodejs.org/en/)  
[Gulp Command Line Utility](https://gulpjs.com/) `npm install -g gulp-cli`

##


**Quick Start**

- In your terminal change to your project directory.
- To install the project use `npm install` for all files and dependencies.
- When complete, run one of the following tasks:
  - `gulp` manually compiles files.
  - `gulp watch` automatically compiles files and applies changes using BrowserSync.

After compiling a new folder called `dist` will appear, this folder will house all your compiled files.

**Note:** Gulp only uses `devDependencies`.

##