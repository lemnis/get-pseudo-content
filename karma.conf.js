module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["mocha", "karma-typescript"],
    files: ["src/**/*.ts", "test/**/*.ts"],
    preprocessors: {
      "**/*.ts": "karma-typescript"
    },
    reporters: ["progress", "karma-typescript"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless", "FirefoxHeadless"],
    CustomFirefox: {
      base: "Firefox",
      flags: ["--headless"]
    },
    singleRun: false,
    concurrency: Infinity
  });
};
