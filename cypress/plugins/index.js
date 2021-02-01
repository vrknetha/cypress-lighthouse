/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const {lighthouse, pa11y, prepareAudit} = require('cypress-audit');
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
    on(`before:browser:launch`, (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
        return launchOptions;
    });

    on('task', {
        lighthouse: lighthouse(lighthouseReport => {
            const categories = lighthouseReport.lhr.categories;
            const audits = lighthouseReport.lhr.audits;
            const formattedAudit = Object.keys(audits).reduce(
                (metrics, curr) => ({
                    ...metrics,
                    [curr]: audits[curr].numericValue
                }),
                {}
            );
            const formattedCategories = Object.keys(categories).reduce(
                (metrics, curr) => ({
                    ...metrics,
                    [curr]: categories[curr].score * 100
                }),
                {}
            );

            const results = {url: lighthouseReport.lhr.requestedUrl, ...formattedCategories};
            fs.writeJSONSync(`./audit.json`, results);
        }),

        pa11y: pa11y(),
    });
}
