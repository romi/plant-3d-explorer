const path = require('path') // Importing 'path' module to handle and manipulate file and directory paths

// Function to modify Webpack configuration during Gatsby's build process
exports.onCreateWebpackConfig = args => {
  // Calling Gatsby's API to set custom Webpack configuration
  args.actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, '../src'), // Resolve imports starting from the '../src' directory (absolute path)
        'node_modules' // Default resolution for third-party modules in 'node_modules'
      ]
    }
  })
}
