# cypress-lighthouse

## Usage

```
npm install
npm run test
```

This generates a json with the categories like performance, pwa , 'best-practices' to a file ./audit.json

```
{
  "url": <requested url>
  "performance": 85,
  "best-practices": 85,
  "pwa": 50
}
```
Make the changes to in the plugins/index.js to upload the performance logs

```js
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
```
