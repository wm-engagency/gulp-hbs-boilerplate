const packageDetails = require('./package.json');

module.exports = {
  paths: {
    input: "src/",
    output: "dist/",
    handlebars: {
      input: "./src/**/*.html",
      output: "dist/",
    },
    styles: {
      input: "./src/assets/scss/**/*.{scss,sass}",
      output: "dist/assets/css",
    },
    scripts: {
      input: "./src/assets/scripts/**/*.js",
      output: "dist/assets/scripts",
    },
    fonts: {
      input: "./src/assets/fonts/*.*",
      output: "dist/assets/fonts"
    },
    icons: {
      input: "./src/assets/icons/*.svg",
      output: "src/assets/fonts",
    },
    images: {
      input: "./src/assets/images/**/*.{png,jpg,jpg,gif,svg}",
      output: "dist/assets/images",
    },
    video: {
      input: "./src/assets/videos/*.mp4",
      output: "dist/assets/videos",
    },
    reload: "./dist",
  },
  banners: {
    full:
    '/*!\n' +
    ' * <%= packageDetails.name %> \n' +
    ' * <%= packageDetails.description %> \n' +
    ' * <%= packageDetails.author %> \n' +
    ' * <%= packageDetails.repository.url %> \n' +
    ' */\n\n',
    min:
    '/*!' +
    ' * <%= packageDetails.name %>' +
    ' | <%= packageDetails.author %>' +
    ' | <%= packageDetails.repository.url %>' +
    ' */\n',
  },
}