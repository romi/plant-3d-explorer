module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: '/src/common/assets'
        }
      }
    }
  ]
}
