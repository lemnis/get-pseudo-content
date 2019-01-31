require("dotenv").config();
const packageJSON = require("./package.json");

const webpack = {
  entry: "./test/index.ts",
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /src\/.*\.ts$/,
        exclude: /node_modules/,
        loader: "istanbul-instrumenter-loader",
        enforce: "post",
        options: {
          esModules: true
        }
      }
    ]
  },
  resolve: { extensions: [".ts", ".js"] }
};

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["mocha"],
    files: ["test/**/*.ts"],
    preprocessors: {
      "test/**/*.ts": ["webpack", "sourcemap"]
    },
    webpack,
    reporters: ["dots", "coverage-istanbul", "BrowserStack"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,

    browserStack: {
      name: packageJSON.name,
      project: packageJSON.name,
      build: packageJSON.version
    },

    customLaunchers: {
      bs_chrome: {
        base: "BrowserStack",
        os: "Windows",
        os_version: "10",
        browser: "Chrome"
      },
      bs_edge: {
        base: "BrowserStack",
        os: "Windows",
        os_version: "10",
        browser: "Edge"
      },
      bs_safari: {
        base: "BrowserStack",
        os: "OS X",
        os_version: "Mojave",
        browser: "Safari"
      },
      bs_firefox: {
        base: "BrowserStack",
        os: "OS X",
        os_version: "Mojave",
        browser: "Firefox"
      }
    },

    browsers: ["bs_chrome", "bs_edge", "bs_safari", "bs_firefox"]
  });
};
