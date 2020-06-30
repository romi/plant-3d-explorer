# 3d Plantviewer

![badge](https://github.com/romi/3d-plantviewer/workflows/Tests/badge.svg)

## Available Scripts
In the project directory, you can run:

### ```npm install```

This is needed to install the dependencies of the project.

To make sure everything works fine, your version of nodejs must be >= 10 and 
your version of npm must be >= 6.

### ```npm test```

This will run the tests for the project. It will permanently run and run again 
on files when they are changed. Multiple commands are available, see
[this](https://create-react-app.dev/docs/running-tests/) for more info.

Each test file is located with the component it is testing. So the tests for the file `src/ScanList/index.js` are located in `src/Scanlist/index.test.js`.

### ```npm start```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You need to add a file `.env.local` at project's root to set the `API URL`:

```
REACT_APP_API_URL='{`API URL}'
```
Whithout this, the app will use `http://localhost:5000`.

To use a local database, you must run the data storage server [from this repository](https://github.com/romi/data-storage).

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
