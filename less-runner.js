const less = require("less");
const path = require('path');
const fs = require("fs");

module.exports = ({ src, filename }) => {
  return less
    .render(src)
    .then(
      result => ({
        css: result.css,
        warnings: [],
        tokens: []
      }),
      error => { console.error(error)});
};