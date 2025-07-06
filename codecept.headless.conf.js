// Headless configuration for CI/CD
const mainConfig = require('./codecept.conf.js');

// Override settings for headless execution
mainConfig.config.helpers.Playwright.show = false;
mainConfig.config.helpers.Playwright.chromium.args.push('--headless');

// Disable interactive plugins for CI
mainConfig.config.plugins.pauseOnFail.enabled = false;
mainConfig.config.plugins.stepByStepReport.enabled = false;

module.exports = mainConfig;