# labelbox-custom-ui

Ops agents use Labelbox to collect structured data about listings in service of products like Flexible Destinations. Due to the complex nature of the Quality Assurance step, the custom editor is used in order to display multiple images in a grid, along with relevant listing information per each image in the grid. Projects are hosted on [Labelbox](https://app.labelbox.com/projects). 

## Dev flow

Because the page is hosted by Labelbox, we test changes by pushing up changes in the `/dev` folder for each project (i.e. `flex-dest/dev` and `a11y/dev`) and setting a test project pointed to this folder path. Once dev changes are verified, copy over the files to the desired project and version, and update the project path in the Labelbox UI. 

Starting in v3 of the flex dest UI, we introduced [npm](https://www.npmjs.com/) as a package manager and [rollup](https://rollupjs.org/guide/en/) for generating a Javascript bundle, which is read in the HTML file. To enable these, you must install the library dependencies, or node modules via:

`npm i`

There's a pre-commit script under `.husky/pre-commit` that runs [prettier](https://prettier.io/) to lint code + rollup to generate the bundle in the `flex-dest/dev` folder. This ensures code changes in the JS files are always synced in the bundle.