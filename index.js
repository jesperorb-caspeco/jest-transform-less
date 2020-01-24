const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const crossSpawn = require("cross-spawn");
const cosmiconfig = require("cosmiconfig");
const stripIndent = require("common-tags/lib/stripIndent");
const THIS_FILE = fs.readFileSync(__filename);
const explorer = cosmiconfig("jesttransformcss");
const transformConfig = explorer.searchSync();

module.exports = {
  getCacheKey: (fileData, filename, configString, { instrument }) => {
    return (
      crypto
        .createHash("md5")
        .update(THIS_FILE)
        .update("\0", "utf8")
        .update(fileData)
        .update("\0", "utf8")
        .update(filename)
        .update("\0", "utf8")
        .update(configString)
        .update("\0", "utf8")
        .update(JSON.stringify(transformConfig))
        .update("\0", "utf8")
        .update(instrument ? "instrument" : "")
        .digest("hex")
    );
  },

  process: (src, filename, config, options) => {
    const lessRunner = path.resolve(__dirname, 'less-runner.js');
    const result = crossSpawn.sync("node", [
      "-e",
      stripIndent`
        require("${lessRunner}")(
          ${JSON.stringify({
            src,
            filename
          })}
        )
        .then(out => { console.log(JSON.stringify(out)) })
      `
    ]);

    const error = result.stderr.toString();
    if (error) throw error;

    let css;
    let tokens;
    try {
      parsed = JSON.parse(result.stdout.toString());
      css = parsed.css;
      tokens = parsed.tokens;
      if (Array.isArray(parsed.warnings))
        parsed.warnings.forEach(warning => {
          console.warn(warning);
        });
    } catch (error) {
      console.error(result.stderr.toString());
      console.log(result.stdout.toString());
      return stripIndent`
        console.error("transform-less: Failed to load '${filename}'");
        module.exports = {};
      `;
    }
    return stripIndent`
      const styleInject = require('style-inject');

      styleInject(${JSON.stringify(css)});
      module.exports = ${JSON.stringify(tokens)};
    `;
  }
};
