# 3d Plantviewer

## Available Scripts
In the project directory, you can run:

### ```npm install```

This is needed to install the dependencies of the project.

To make sure everything works fine, your version of nodejs must be >= 10 and 
your version of npm must be >= 6.

### ```npm start```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You need to add a file `.env.local` at project's root to set the `API URL`:

```
REACT_APP_API_URL='{`API URL}'
```
Whithout this, the app will use `http://localhost:5000`.

To use a local database, you must run the data storage server [from this repository](https://github.com/romi/data-storage).

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
