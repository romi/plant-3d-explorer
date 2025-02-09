export default {
  ignore: ['README.md'], // Files to ignore (e.g., README.md will not be processed)
  title: 'ROMI Plant 3D Explorer', // Application title displayed in the UI
  base: '/plant-3d-explorer/', // Base URL for the application deployment (used for routing and assets)
  hashRouter: true, // Use hash-based routing (applicable for SPAs to ensure compatibility with static hosting)
  menu: [
    'Home', // Main navigation option for the homepage
    'Project architecture', // Menu item redirecting to the project architecture documentation
    'Redux store', // Section to explore Redux store structure
    'Components' // Section dedicated to the component details and documentation
  ]
}
